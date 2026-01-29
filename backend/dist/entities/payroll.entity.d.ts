import { ObjectId } from 'typeorm';
export type PayrollStatus = 'draft' | 'processed' | 'paid';
export declare class SalaryStructure {
    _id: ObjectId;
    employeeId: ObjectId;
    earnings: {
        name: string;
        code?: string;
        amount: number;
        taxable?: boolean;
    }[];
    deductions: {
        name: string;
        code?: string;
        amount: number;
    }[];
    reimbursements: {
        name: string;
        code?: string;
        amount: number;
    }[];
    effectiveFrom?: Date;
    organizationId: ObjectId;
    createdAt: Date;
    updatedAt?: Date;
    constructor();
}
export declare class PayrollRun {
    _id: ObjectId;
    organizationId: ObjectId;
    month: number;
    year: number;
    status: PayrollStatus;
    items: PayrollItem[];
    createdAt: Date;
    processedAt?: Date;
    constructor();
}
export declare class PayrollItem {
    employeeId: ObjectId;
    gross: number;
    deductions: number;
    net: number;
    components: {
        name: string;
        amount: number;
        type: 'earning' | 'deduction' | 'reimbursement';
    }[];
    payslipUrl?: string;
}
