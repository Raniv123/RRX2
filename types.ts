export type Screen = 'LOGIN' | 'MENU' | 'JOURNEY' | 'SCENARIO' | 'TIPS' | 'DICE';

export interface ScenarioData {
    title: string;
    roles: string[];
    loc: string;
    rule: string;
    steps: string[];
}

export interface TipData {
    id: number;
    title: string;
    content: string;
    icon: string;
}

export interface CardData {
    id: number;
    phase: 'FOREPLAY' | 'HEAT' | 'TRANSITION' | '69' | 'POSITIONS' | 'FINALE'; 
    isStation?: boolean;
    level: number;
    type: 'TECHNIQUE' | 'INSTRUCTION' | 'POSITION' | 'SURPRISE';
    role: 'BOTH' | 'MAN' | 'WOMAN';
    text: string;
    sub: string;
    desc: string;
    details?: string;
    /** Generic secret — shown to both partners. Used when no gender-specific secret exists. */
    secret?: string;
    /** Secret meant for HER eyes only — she reveals when it's her turn. */
    secretShe?: string;
    /** Secret meant for HIS eyes only — he reveals when it's his turn. */
    secretHe?: string;
    icon: string;
    timer?: number;
}