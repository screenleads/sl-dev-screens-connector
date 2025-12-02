export interface Auditable {
    createdAt: string; // ISO
    updatedAt: string; // ISO
    createdBy?: string;
    updatedBy?: string;
}
