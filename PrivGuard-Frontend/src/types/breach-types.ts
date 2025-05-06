// src/types/breach-types.ts
export interface BreachDetails {
    breach: string;
    details: string;
    domain: string;
    industry: string;
    logo: string;
    password_risk: string;
    references: string;
    searchable: string;
    verified: string;
    xposed_data: string;
    xposed_date: string;
    xposed_records: number;
}

export interface PasswordStrength {
    EasyToCrack: number;
    PlainText: number;
    StrongHash: number;
    Unknown: number;
}

export interface RiskMetric {
    risk_label: string;
    risk_score: number;
}

export interface YearwiseDetails {
    [key: string]: number;  // e.g., "y2020": 1
}

export interface BreachResponse {
    BreachMetrics: {
        risk: RiskMetric[];
        yearwise_details: YearwiseDetails[];
        passwords_strength: PasswordStrength[];
        xposed_data: any[];
    };
    BreachesSummary: {
        site: string;
    };
    ExposedBreaches: {
        breaches_details: BreachDetails[];
    };
}