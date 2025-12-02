import { CouponStatus } from './CouponStatus';

export interface PromotionLead {
    id: number;
    promotionId: number;
    leadId: number;
    status: CouponStatus;
    createdAt: string; // ISO
}
