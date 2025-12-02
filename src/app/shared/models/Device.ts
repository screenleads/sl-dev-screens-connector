import { Company } from './Company';
import { DeviceType } from './DeviceType';


export interface Device {
    id: number;
    uuid: string;
    type: DeviceType;
    descriptionName?: string;
    width?: number;
    height?: number;
    company?: Company;
}
