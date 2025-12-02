import { AdviceTimeWindow } from "./AdviceTimeWindow";

export interface AdviceSchedule {
    id: number;
    adviceId: number;
    startDate: string; // ISO
    endDate: string;   // ISO
    timeWindows: AdviceTimeWindow[];
}
