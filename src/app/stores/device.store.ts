import { Injectable, signal, computed, inject, WritableSignal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';

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
            this.uuid = parsed.uuid;
            this.logger.info('[DeviceStore] Dispositivo cargado desde localStorage', parsed);
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

    fetchDeviceTypes() {
        this.http.get<any[]>(`${this.config.apiUrl}/devices/types`).subscribe({
            next: types => {
                this._deviceTypes.set(types);
                this.logger.debug('[DeviceStore] Tipos de dispositivo recibidos:', types);
            },
            error: err => {
                this.logger.error('[DeviceStore] Error al obtener tipos de dispositivo', err);
            }
        });
    }

    registerDevice() {
        const payload = this.createDeviceObject();
        this.logger.info('[DeviceStore] Registrando dispositivo con datos:', payload);

        this.http.post(`${this.config.apiUrl}/devices`, payload).subscribe({
            next: (device: any) => {
                this._device.set(device);
                this._isRegistered.set(true);
                localStorage.setItem('device', JSON.stringify(device));
                this.router.navigate(['connect']);
                this.logger.info('[DeviceStore] Dispositivo registrado correctamente');
            },
            error: err => {
                this.logger.error('[DeviceStore] Error al registrar dispositivo', err);
            }
        });
    }

    updateDeviceName(descriptionName: string) {
        const deviceAux = { ...this._device(), descriptionName };
        this.http.put(`${this.config.apiUrl}/devices/${deviceAux.id}`, deviceAux).subscribe({
            next: updated => {
                this._device.set(updated);
                localStorage.setItem('device', JSON.stringify(updated));
                this.logger.info('[DeviceStore] Nombre del dispositivo actualizado', updated);
            },
            error: err => this.logger.error('[DeviceStore] Error al actualizar nombre del dispositivo', err)
        });
    }

    private createDeviceObject() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const company = localStorage.getItem('company');
        let deviceType = 'tv';

        if (width <= 768) deviceType = 'mobile';
        else if (width <= 1024) deviceType = 'tablet';

        const typeEntity = this._deviceTypes().find(t => t.type === deviceType);

        return {
            uuid: this.uuid,
            descriptionName: '',
            width,
            height,
            type: typeEntity,
            company: { id: company }
        };
    }
}
