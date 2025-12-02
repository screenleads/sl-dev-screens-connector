import { Company } from './Company';

describe('Company model', () => {
    it('should create a valid Company object', () => {
        const company = new Company({ id: 1, name: 'ScreenLeads', observations: 'Empresa de pantallas', logo: null });
        expect(company.id).toBe(1);
        expect(company.name).toBe('ScreenLeads');
        expect(company.logo).toBeNull();
    });

    it('should set and get properties', () => {
        const company = new Company();
        company.id = 2;
        company.name = 'TestCo';
        company.observations = 'Obs';
        company.logo = { id: 99, src: 'logo.png', type: undefined } as any;
        expect(company.id).toBe(2);
        expect(company.name).toBe('TestCo');
        expect(company.observations).toBe('Obs');
        expect(company.logo).toEqual({ id: 99, src: 'logo.png', type: undefined });
    });

    it('should handle default and edge values', () => {
        const company = new Company();
        expect(company.id).toBe(0);
        expect(company.name).toBe('');
        expect(company.observations).toBe('');
        expect(company.logo).toBeNull();
    });

    it('should trim name and observations', () => {
        const company = new Company();
        company.name = '  TrimmedName  ';
        company.observations = '  TrimmedObs  ';
        expect(company.name).toBe('TrimmedName');
        expect(company.observations).toBe('TrimmedObs');
    });
});
