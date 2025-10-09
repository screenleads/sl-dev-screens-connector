import { Injectable, signal, computed, inject, WritableSignal, effect, EffectRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { WebsocketStateStore } from './webscoket.store';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class DeviceStore {
    private _device: WritableSignal<any> = signal(null);
    private _deviceTypes: WritableSignal<any[]> = signal([]);
    private _isRegistered = signal(false);
    private uuid = uuidv4();

    readonly device = computed(() => this._device());
    readonly deviceTypes = computed(() => this._deviceTypes());
    readonly isRegistered = computed(() => this._isRegistered());

    private http = inject(HttpClient);
    private config = inject(APP_CONFIG);
    private logger = inject(NGXLogger);
    private wsStore = inject(WebsocketStateStore);
    private router = inject(Router);
    private auth = inject(AuthStore);

    constructor() {
        const saved = localStorage.getItem('device');
        if (saved) {
            const parsed = JSON.parse(saved);
            this._device.set(parsed);
            this._isRegistered.set(true);
            if (parsed?.uuid) this.uuid = parsed.uuid;
            this.logger.info('[DeviceStore] Dispositivo cargado desde localStorage', parsed);
            // Validación inicial contra backend por UUID
            this.verifyAndRecoverByUuid().catch(err =>
                this.logger.error('[DeviceStore] Error verificando dispositivo al iniciar', err)
            );
        } else {
            this.logger.warn('[DeviceStore] Dispositivo no registrado aún. UUID generado:', this.uuid);
        }

        // Cargar tipos al tener usuario y token
        effect(() => {
            const token = this.auth.token;
            const user = this.auth.user();
            if (token && user) {
                this.logger.debug('[DeviceStore] Token y usuario disponibles. Cargando tipos de dispositivo...');
                this.fetchDeviceTypes();
            }
        });
    }

    // ================== API helpers ==================

    private async getDeviceByUuid(uuid: string) {
        try {
            return await firstValueFrom(
                this.http.get<any>(`${this.config.apiUrl}/devices/uuid/${encodeURIComponent(uuid)}`)
            );
        } catch (err: any) {
            if (err?.status === 404 || err?.status === 410) return null;
            throw err;
        }
    }

    private async getDeviceById(id: number | string) {
        try {
            return await firstValueFrom(this.http.get<any>(`${this.config.apiUrl}/devices/${id}`));
        } catch (err: any) {
            if (err?.status === 404 || err?.status === 410) return null;
            throw err;
        }
    }

    private setDevice(device: any) {
        this._device.set(device);
        this._isRegistered.set(!!device);
        if (device) {
            localStorage.setItem('device', JSON.stringify(device));
            if (device?.uuid) this.uuid = device.uuid;
        }
    }

    private clearDevice(reason?: string) {
        this.logger.warn('[DeviceStore] Limpiando dispositivo local. Motivo:', reason || 'desconocido');
        this._device.set(null);
        this._isRegistered.set(false);
        localStorage.removeItem('device');
        try { (this.wsStore as any)?.disconnect?.(); } catch { }
    }

    // ================== Verificación & recuperación ==================

    async verifyAndRecoverByUuid() {
        const current = this._device();
        const uuid = current?.uuid || this.uuid;
        if (!uuid) return;

        const remote = await this.getDeviceByUuid(uuid);
        if (!remote) {
            this.logger.warn('[DeviceStore] El dispositivo con UUID no existe en backend. Se re-registrará.');
            this.clearDevice('no-existe-en-backend');
            await this.registerDevice();
            return;
        }

        if (!current || current.id !== remote.id) {
            this.logger.info('[DeviceStore] Sync local ↔ backend por UUID', { local: current?.id, remote: remote.id });
            this.setDevice(remote);
        }
    }

    // ================== Tipos de dispositivo ==================

    fetchDeviceTypes() {
        this.http.get<any[]>(`${this.config.apiUrl}/devices/types`).subscribe({
            next: types => {
                this._deviceTypes.set(types || []);
                this.logger.debug('[DeviceStore] Tipos de dispositivo recibidos:', types);
            },
            error: err => {
                this.logger.error('[DeviceStore] Error al obtener tipos de dispositivo', err);
            }
        });
    }

    private async ensureDeviceTypesLoaded() {
        if (this._deviceTypes().length > 0) return;

        this.fetchDeviceTypes();

        await new Promise<void>((resolve) => {
            let ref: EffectRef;
            ref = effect(() => {
                if (this._deviceTypes().length > 0) {
                    ref.destroy();
                    resolve();
                }
            });
            // Fallback a 3s por si falla la carga (evita colgar)
            setTimeout(() => {
                try { ref.destroy(); } catch { }
                resolve();
            }, 3000);
        });
    }

    // ================== Registro / actualización ==================

    async registerDevice() {
        await this.ensureDeviceTypesLoaded();

        const payload = this.createDeviceObject();
        this.logger.info('[DeviceStore] Registrando dispositivo con datos:', payload);

        try {
            // Idempotencia por UUID: si ya existe en backend, úsalo
            const existing = await this.getDeviceByUuid(payload.uuid);
            if (existing) {
                this.logger.info('[DeviceStore] Dispositivo ya existía. Se usará el remoto.');
                this.setDevice(existing);
                this.router.navigate(['connect']);
                return;
            }

            const device = await firstValueFrom(
                this.http.post<any>(`${this.config.apiUrl}/devices`, payload)
            );
            this.setDevice(device);
            this.router.navigate(['connect']);
            this.logger.info('[DeviceStore] Dispositivo registrado correctamente');
        } catch (err) {
            this.logger.error('[DeviceStore] Error al registrar dispositivo', err);
            throw err;
        }
    }

    async updateDeviceName(descriptionName: string) {
        const current = this._device();
        if (!current?.id) {
            this.logger.warn('[DeviceStore] No hay dispositivo local para actualizar nombre. Intentando verificar/registrar.');
            await this.verifyAndRecoverByUuid();
        }

        const deviceAux = { ...(this._device() || {}), descriptionName };
        if (!deviceAux?.id) {
            await this.registerDevice();
        }

        try {
            const updated = await firstValueFrom(
                this.http.put<any>(`${this.config.apiUrl}/devices/${deviceAux.id}`, deviceAux)
            );
            this.setDevice(updated);
            this.logger.info('[DeviceStore] Nombre del dispositivo actualizado', updated);
        } catch (err: any) {
            if (err?.status === 404 || err?.status === 410) {
                this.logger.warn('[DeviceStore] Dispositivo no existe (404/410) al actualizar. Re-registrando…');
                this.clearDevice('404-update-name');
                await this.registerDevice();
                const retry = { ...(this._device() || {}), descriptionName };
                const updated = await firstValueFrom(
                    this.http.put<any>(`${this.config.apiUrl}/devices/${retry.id}`, retry)
                );
                this.setDevice(updated);
                this.logger.info('[DeviceStore] Nombre del dispositivo actualizado tras re-registro', updated);
            } else {
                this.logger.error('[DeviceStore] Error al actualizar nombre del dispositivo', err);
                throw err;
            }
        }
    }

    // ================== Payload ==================

    private createDeviceObject() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const company = localStorage.getItem('company');
        let deviceType = 'tv';

        if (width <= 768) deviceType = 'mobile';
        else if (width <= 1024) deviceType = 'tablet';

        const typeEntity = this._deviceTypes().find(t => t?.type === deviceType) ?? null;

        let companyId: any = company;
        try {
            const parsed = JSON.parse(company as any);
            companyId = parsed?.id ?? company;
        } catch { }

        return {
            uuid: this.uuid,
            descriptionName: '',
            width,
            height,
            type: typeEntity, // si es null, el backend devolverá 400 (validación)
            company: companyId ? { id: companyId } : null
        };
    }
}
