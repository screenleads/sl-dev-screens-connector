import { LoggingService } from 'src/app/shared/services/logging.service';
import { Injectable, signal, computed, inject, WritableSignal, effect, EffectRef } from '@angular/core';
// ...existing code...
import { ApiConnectionService } from 'src/app/shared/services/api-connection.service';
import { v4 as uuidv4 } from 'uuid';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { ErrorLoggerService } from 'src/app/shared/services/error-logger.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { WebsocketStateStore } from './webscoket.store';
import { AuthStore } from './auth.store';
import { Device } from 'src/app/shared/models/Device';
import { DeviceType } from 'src/app/shared/models/DeviceType';
import { Company } from 'src/app/shared/models/Company';

@Injectable({ providedIn: 'root' })
export class DeviceStore {
    private _device: WritableSignal<Device | null> = signal(null);
    private _deviceTypes: WritableSignal<DeviceType[]> = signal([]);
    private _isRegistered = signal(false);
    private uuid = uuidv4();

    readonly device = computed(() => this._device());
    readonly deviceTypes = computed(() => this._deviceTypes());
    readonly isRegistered = computed(() => this._isRegistered());

    private api = inject(ApiConnectionService);
    // ...existing code...
    private errorLogger = inject(ErrorLoggerService);
    private logger = inject(LoggingService);
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
            this.logger.log('[DeviceStore] Dispositivo cargado desde localStorage', parsed as any);
            // Validación inicial contra backend por UUID
            this.verifyAndRecoverByUuid().catch(err =>
                this.errorLogger.error('[DeviceStore] Error verificando dispositivo al iniciar', err)
            );
        } else {
            this.logger.log('[DeviceStore] Dispositivo no registrado aún. UUID generado', { uuid: this.uuid } as any);
        }

        // Cargar tipos al tener usuario y token
        effect(() => {
            const token = this.auth.token;
            const user = this.auth.user();
            if (token && user) {
                this.logger.log('[DeviceStore] Token y usuario disponibles. Cargando tipos de dispositivo...' as any);
                this.fetchDeviceTypes();
            }
        });
    }

    // ================== API helpers ==================

    private async getDeviceByUuid(uuid: string): Promise<Device | null> {
        try {
            return await firstValueFrom(
                this.api.get<Device>(`devices/uuid/${encodeURIComponent(uuid)}`)
            );
        } catch (err: any) {
            if (err?.status === 404 || err?.status === 410) return null;
            throw err;
        }
    }

    private async getDeviceById(id: number | string): Promise<Device | null> {
        try {
            return await firstValueFrom(this.api.get<Device>(`devices/${id}`));
        } catch (err: any) {
            if (err?.status === 404 || err?.status === 410) return null;
            throw err;
        }
    }

    private setDevice(device: Device | null) {
        this._device.set(device);
        this._isRegistered.set(!!device);
        if (device) {
            localStorage.setItem('device', JSON.stringify(device));
            if (device?.uuid) this.uuid = device.uuid;
        }
    }

    private clearDevice(reason?: string) {
        this.logger.log('[DeviceStore] Limpiando dispositivo local. Motivo', { reason: reason || 'desconocido' } as any);
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
            this.logger.log('[DeviceStore] El dispositivo con UUID no existe en backend. Se re-registrará.' as any);
            this.clearDevice('no-existe-en-backend');
            await this.registerDevice();
            return;
        }

        if (!current || current.id !== remote.id) {
            this.logger.log('[DeviceStore] Sync local ↔ backend por UUID', { local: current?.id, remote: remote.id } as any);
            this.setDevice(remote);
        }
    }

    // ================== Tipos de dispositivo ==================

    fetchDeviceTypes() {
        this.api.get<DeviceType[]>(`devices/types`).subscribe({
            next: types => {
                this._deviceTypes.set(types || []);
                this.logger.log('[DeviceStore] Tipos de dispositivo recibidos', { types } as any);
            },
            error: err => {
                this.logger.error('[DeviceStore] Error al obtener tipos de dispositivo', err as any);
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
        this.logger.log('[DeviceStore] Registrando dispositivo con datos', { payload } as any);

        try {
            // Idempotencia por UUID: si ya existe en backend, úsalo
            const uuid = typeof payload.uuid === 'string' ? payload.uuid : this.uuid;
            const existing = await this.getDeviceByUuid(uuid);
            if (existing) {
                this.logger.log('[DeviceStore] Dispositivo ya existía. Se usará el remoto.' as any);
                this.setDevice(existing);
                this.router.navigate(['connect']);
                return;
            }

            const device = await firstValueFrom(
                this.api.post<Device>(`devices`, payload)
            );
            this.setDevice(device);
            this.router.navigate(['connect']);
            this.logger.log('[DeviceStore] Dispositivo registrado correctamente' as any);
        } catch (err) {
            this.errorLogger.error('[DeviceStore] Error al registrar dispositivo', err);
            throw err;
        }
    }

    async updateDeviceName(descriptionName: string) {
        const current = this._device();
        if (!current?.id) {
            this.logger.log('[DeviceStore] No hay dispositivo local para actualizar nombre. Intentando verificar/registrar.' as any);
            await this.verifyAndRecoverByUuid();
        }

        // Creamos un objeto Device con todos los campos obligatorios
        const deviceAux: Device = {
            id: current?.id ?? 0,
            uuid: current?.uuid ?? this.uuid,
            type: current?.type ?? { id: 0, type: '' },
            descriptionName,
            width: current?.width ?? window.innerWidth,
            height: current?.height ?? window.innerHeight,
            company: current?.company ?? undefined
        };
        if (!deviceAux?.id) {
            await this.registerDevice();
        }

        try {
            const updated = await firstValueFrom(
                this.api.put<Device>(`devices/${deviceAux.id}`, deviceAux)
            );
            this.setDevice(updated);
            this.logger.log('[DeviceStore] Nombre del dispositivo actualizado', { updated } as any);
        } catch (err: any) {
            if (err?.status === 404 || err?.status === 410) {
                this.logger.log('[DeviceStore] Dispositivo no existe (404/410) al actualizar. Re-registrando…' as any);
                this.clearDevice('404-update-name');
                await this.registerDevice();
                const retryCurrent = this._device();
                const retry: Device = {
                    id: retryCurrent?.id ?? 0,
                    uuid: retryCurrent?.uuid ?? this.uuid,
                    type: retryCurrent?.type ?? { id: 0, type: '' },
                    descriptionName,
                    width: retryCurrent?.width ?? window.innerWidth,
                    height: retryCurrent?.height ?? window.innerHeight,
                    company: retryCurrent?.company ?? undefined
                };
                const updated = await firstValueFrom(
                    this.api.put<Device>(`devices/${retry.id}`, retry)
                );
                this.setDevice(updated);
                this.logger.log('[DeviceStore] Nombre del dispositivo actualizado tras re-registro', { updated } as any);
            } else {
                this.logger.error('[DeviceStore] Error al actualizar nombre del dispositivo', err as any);
                throw err;
            }
        }
    }

    // ================== Payload ==================

    private createDeviceObject(): Partial<Device> {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const company = localStorage.getItem('company');
        let deviceType = 'tv';

        if (width <= 768) deviceType = 'mobile';
        else if (width <= 1024) deviceType = 'tablet';

        const typeEntity: DeviceType | undefined = this._deviceTypes().find(t => t?.type === deviceType);

        let companyId: number | undefined = undefined;
        const api = this.api;
        try {
            const parsed = api.safeJsonParse<{ id?: number }>(company as string);
            companyId = parsed && typeof parsed.id === 'number' ? parsed.id : undefined;
        } catch { }

        let companyObj: Company | undefined = undefined;
        if (companyId !== undefined) {
            companyObj = { id: companyId, name: '', observations: '', logo: null } as Company;
        }

        return {
            uuid: this.uuid,
            descriptionName: '',
            width,
            height,
            type: typeEntity,
            company: companyObj
        };
    }
}
