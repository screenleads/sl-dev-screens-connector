import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
    providedIn: 'root'
})
export class DateUtilsService {
    /**
     * Parsea una cadena de tiempo ("hh:mm") o array [hh, mm] a objeto { h, m }
     */
    parseTime(input: string | number[]): { h: number; m: number } | null {
        if (Array.isArray(input) && input.length >= 2
            && Number.isFinite(+input[0]) && Number.isFinite(+input[1])) {
            return { h: +input[0], m: +input[1] };
        }
        if (typeof input === 'string') {
            const m = input.match(/^([0-9]{1,2}):([0-9]{2})(?::[0-9]{2})?$/);
            if (m) return { h: +m[1], m: +m[2] };
        }
        return null;
    }

    /**
     * Normaliza nombre de día ES→EN
     */
    normalizeDayName(day: string): string {
        const map: Record<string, string> = {
            'LUNES': 'MONDAY', 'MARTES': 'TUESDAY', 'MIERCOLES': 'WEDNESDAY', 'MIÉRCOLES': 'WEDNESDAY',
            'JUEVES': 'THURSDAY', 'VIERNES': 'FRIDAY', 'SABADO': 'SATURDAY', 'SÁBADO': 'SATURDAY', 'DOMINGO': 'SUNDAY'
        };
        const d = day.toUpperCase();
        return map[d] || d;
    }

    /**
     * Valida si un advice es visible según reglas de tiempo
     */
    isAdviceVisible(advice: any): boolean {
        if (!advice?.visibilityRules || advice.visibilityRules.length === 0) return true;

        // Usar luxon para obtener la fecha actual en Madrid
        // DateTime ya importado arriba
        const now = DateTime.now().setZone('Europe/Madrid');
        const currentDay = now.setLocale('en').toFormat('cccc').toUpperCase(); // "WEDNESDAY"
        const currentMinutes = now.hour * 60 + now.minute;

        for (const rule of advice.visibilityRules ?? []) {
            if (!rule) continue;
            const ruleDay = this.normalizeDayName(rule.day);
            if (ruleDay !== currentDay) continue;
            const ranges = rule.timeRanges ?? [];
            // Sin rangos → visible todo el día
            if (!Array.isArray(ranges) || ranges.length === 0) return true;
            for (const range of ranges) {
                if (!range) continue;
                const fromRaw = range.fromTime;
                const toRaw = range.toTime;
                // Ambos null → visible todo el día
                if (fromRaw == null && toRaw == null) return true;
                const fromParsed = this.parseTime(fromRaw);
                const toParsed = this.parseTime(toRaw);
                // Si alguno viene mal formado, lo ignoramos
                if (!fromParsed || !toParsed) continue;
                const fromMinutes = fromParsed.h * 60 + fromParsed.m;
                const toMinutes = toParsed.h * 60 + toParsed.m;
                if (fromMinutes <= toMinutes) {
                    // Rango normal (mismo día)
                    if (currentMinutes >= fromMinutes && currentMinutes <= toMinutes) return true;
                } else {
                    // Rango que cruza medianoche
                    if (currentMinutes >= fromMinutes || currentMinutes <= toMinutes) return true;
                }
            }
        }
        return false;
    }
}
