import { Company } from './Company';

export interface Customer {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    company?: Company;
}
