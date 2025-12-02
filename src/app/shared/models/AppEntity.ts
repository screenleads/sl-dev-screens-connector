import { AppEntityAttribute } from "./AppEntityAttribute";

export interface AppEntity {
    id: number;
    name: string;
    attributes: AppEntityAttribute[];
}
