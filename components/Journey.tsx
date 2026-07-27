import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CARDS } from '../data/content';
import { CardData } from '../types';
import { Button, Modal } from './UI';

interface JourneyProps {
    onExit: () => void;
}

/** 23 steps — extended journey with more her-focused warm-up and deeper exploration */
const TOTAL_STEPS = 23;

interface StepDef {
    title: string;
    phase: 'FOREPLAY' | 'HEAT' | 'TRANSITION' | '69' | 'POSITIONS' | 'FINALE';
    phaseLabel: string;
    accent: 'gold' | 'ember' | 'rose' | 'blood' | 'bone';
    filter: (cards: CardData[]) => CardData[];
    fallbackId?: number;
}

const STEPS: StepDef[] = [
    { // 0
        title: 'פתיחה',
        phase: 'FOREPLAY',
        phaseLabel: 'PHASE I · FOREPLAY',
        accent: 'gold',
        filter: c => c.filter(x => x.phase === 'FOREPLAY' && x.level === 0),
    },
    { // 1
        title: 'חיבור',
        phase: 'FOREPLAY',
        phaseLabel: 'PHASE I · FOREPLAY',
        accent: 'gold',
        filter: c => c.filter(x => x.phase === 'FOREPLAY' && x.level === 1 && x.type !== 'SURPRISE'),
    },
    { // 2
        title: 'חושים',
        phase: 'FOREPLAY',
        phaseLabel: 'PHASE I · FOREPLAY',
        accent: 'gold',
        filter: c => c.filter(x => (x.phase === 'FOREPLAY' && x.type === 'SURPRISE') || x.id === 104 || x.id === 1018),
    },
    { // 3 — ⭐ NEW: He warms her up (gentle), per Nagoski's "accelerator" pattern
        title: 'הוא מחמם · עדין',
        phase: 'FOREPLAY',
        phaseLabel: 'PHASE I · FOREPLAY',
        accent: 'ember',
        filter: c => c.filter(x => x.phase === 'FOREPLAY' && x.role === 'MAN' && x.level <= 1),
        fallbackId: 103,
    },
    { // 4 — Intense touch (level 2) — all roles welcome (incl. 1002 her feather)
        title: 'מגע אינטנסיבי',
        phase: 'FOREPLAY',
        phaseLabel: 'PHASE I · FOREPLAY',
        accent: 'ember',
        filter: c => c.filter(x => x.phase === 'FOREPLAY' && x.level === 2),
    },
    { // 5 — ⭐ NEW: Focused teasing — he stays at her thighs
        title: 'פיתוי מרוכז · עליה',
        phase: 'FOREPLAY',
        phaseLabel: 'PHASE I · FOREPLAY',
        accent: 'rose',
        filter: c => c.filter(x => x.phase === 'FOREPLAY' && x.role === 'MAN' && x.level === 2),
        fallbackId: 111,
    },
    { // 6 — Station 1
        title: 'תחנה I · ההבטחה',
        phase: 'TRANSITION',
        phaseLabel: 'STATION I',
        accent: 'bone',
        filter: c => c.filter(x => x.id === 199),
        fallbackId: 199,
    },
    { // 7 — Her hands first — handjob style (timer 80 + 1024 + 1026)
        title: 'היא · בידיים',
        phase: 'HEAT',
        phaseLabel: 'PHASE II · HEAT',
        accent: 'rose',
        filter: c => c.filter(x => x.phase === 'HEAT' && x.role === 'WOMAN' && (x.timer ?? 0) <= 90),
    },
    { // 8 — Her mouth — oral, slower (timer 100+)
        title: 'היא · יורדת',
        phase: 'HEAT',
        phaseLabel: 'PHASE II · HEAT',
        accent: 'rose',
        filter: c => c.filter(x => x.phase === 'HEAT' && x.role === 'WOMAN' && (x.timer ?? 0) >= 100),
    },
    { // 9 — His warm-up tease
        title: 'הוא · מקניט',
        phase: 'HEAT',
        phaseLabel: 'PHASE II · HEAT',
        accent: 'rose',
        filter: c => c.filter(x => x.phase === 'HEAT' && x.role === 'MAN' && (x.timer ?? 0) >= 100 && (x.timer ?? 0) <= 130),
    },
    { // 10 — His oral — first pass
        title: 'הוא · יורד',
        phase: 'HEAT',
        phaseLabel: 'PHASE II · HEAT',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'HEAT' && x.role === 'MAN' && (x.timer ?? 0) >= 140),
    },
    { // 11 — His oral — deeper / combined (with hands)
        title: 'הוא · עמוק יותר',
        phase: 'HEAT',
        phaseLabel: 'PHASE II · HEAT',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'HEAT' && x.role === 'MAN' && (x.timer ?? 0) >= 140),
    },
    { // 12 — Mutual mirror moment (HEAT BOTH like 1009)
        title: 'שניכם · מראה',
        phase: 'HEAT',
        phaseLabel: 'PHASE II · HEAT',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'HEAT' && x.role === 'BOTH'),
        fallbackId: 1009,
    },
    { // 13 — 69
        title: 'הדדי · 69',
        phase: '69',
        phaseLabel: 'PHASE III · 69',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === '69'),
    },
    { // 14 — Station 2
        title: 'תחנה II · הסנטימטר הקדוש',
        phase: 'TRANSITION',
        phaseLabel: 'STATION II',
        accent: 'bone',
        filter: c => c.filter(x => x.id === 800),
        fallbackId: 800,
    },
    { // 15 — Friction (incl. 1019 surprise whisper)
        title: 'תשוקה · בלי חדירה',
        phase: 'TRANSITION',
        phaseLabel: 'TRANSITION',
        accent: 'blood',
        filter: c => c.filter(x => x.id === 801 || x.id === 802 || x.id === 1019),
    },
    { // 16 — Position 1 — intimate
        title: 'תנוחה I · אינטימית',
        phase: 'POSITIONS',
        phaseLabel: 'PHASE IV · POSITIONS',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'POSITIONS' && x.level === 4),
    },
    { // 17 — Position 2 — deep
        title: 'תנוחה II · עמוקה',
        phase: 'POSITIONS',
        phaseLabel: 'PHASE IV · POSITIONS',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'POSITIONS' && x.level === 4),
    },
    { // 18 — Position 3 — unique
        title: 'תנוחה III · ייחודית',
        phase: 'POSITIONS',
        phaseLabel: 'PHASE IV · POSITIONS',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'POSITIONS' && x.level >= 4),
    },
    { // 19 — Position 4 / Climax
        title: 'תנוחה IV · שיא',
        phase: 'POSITIONS',
        phaseLabel: 'PHASE IV · POSITIONS',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'POSITIONS' && x.level === 5),
    },
    { // 20 — Position 5 / Bonus climax
        title: 'תנוחה V · בונוס שיא',
        phase: 'POSITIONS',
        phaseLabel: 'PHASE IV · POSITIONS',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'POSITIONS' && x.level === 5),
    },
    { // 21 — Edging
        title: 'הגלישה',
        phase: 'FINALE',
        phaseLabel: 'FINALE',
        accent: 'bone',
        filter: c => c.filter(x => x.id === 501),
        fallbackId: 501,
    },
    { // 22 — Release
        title: 'השחרור',
        phase: 'FINALE',
        phaseLabel: 'FINALE',
        accent: 'bone',
        filter: c => c.filter(x => x.id === 504 || x.id === 1039),
    },
];

const accentText = (a: StepDef['accent']) =>
    a === 'gold'  ? 'text-azure'      :
    a === 'ember' ? 'text-violet'     :
    a === 'rose'  ? 'text-rose-soft'  :
    a === 'blood' ? 'text-rose'       : 'text-bone';

const accentGlow = (a: StepDef['accent']) =>
    a === 'gold'  ? 'glow-azure'  :
    a === 'ember' ? 'glow-violet' :
    a === 'rose'  ? 'glow-rose'   :
    a === 'blood' ? 'glow-rose'   : 'glow-soft';

export const Journey: React.FC<JourneyProps> = ({ onExit }) => {
    const [step, setStep] = useState(0);
    const [currentCard, setCurrentCard] = useState<CardData | null>(null);
    const [phase, setPhase] = useState<'idle' | 'in' | 'out'>('idle');
    const [playedCardIds, setPlayedCardIds] = useState<Set<number>>(new Set());
    const [done, setDone] = useState(false);

    const progress = useMemo(
        () => Math.min(((step + 1) / TOTAL_STEPS) * 100, 100),
        [step]
    );

    const currentStep = STEPS[Math.min(step, TOTAL_STEPS - 1)];

    const drawCard = () => {
        const def = STEPS[step];
        if (!def) {
            setDone(true);
            return;
        }
        const pool = def.filter(CARDS);
        // Avoid repeats within session, fall back to full pool, then to defined fallbackId, then to first card in pool.
        let candidates = pool.filter(c => !playedCardIds.has(c.id));
        if (candidates.length === 0) candidates = pool;

        let next: CardData | undefined;
        if (candidates.length > 0) {
            next = candidates[Math.floor(Math.random() * candidates.length)];
        } else if (def.fallbackId) {
            next = CARDS.find(c => c.id === def.fallbackId);
        }
        if (!next) {
            // Last-ditch: emergency card from same phase, ignoring filter
            next = CARDS.find(c => c.phase === def.phase) || CARDS[0];
        }

        setPhase('in');
        setPlayedCardIds(prev => new Set(prev).add(next!.id));
        setCurrentCard(next!);
    };

    const completeCard = () => {
        setPhase('out');
        setTimeout(() => {
            setCurrentCard(null);
            setPhase('idle');
            if (step >= TOTAL_STEPS - 1) {
                setDone(true);
            } else {
                setStep(s => s + 1);
            }
        }, 380);
    };

    const swapCard = () => {
        if (!currentCard) return;
        const def = STEPS[step];
        const pool = def.filter(CARDS).filter(c =>
            c.id !== currentCard.id && !c.isStation && !playedCardIds.has(c.id)
        );
        const safePool = pool.length > 0 ? pool : def.filter(CARDS).filter(c => c.id !== currentCard.id && !c.isStation);
        if (safePool.length === 0) return;
        const next = safePool[Math.floor(Math.random() * safePool.length)];
        setPhase('out');
        setTimeout(() => {
            setCurrentCard(next);
            setPlayedCardIds(prev => new Set(prev).add(next.id));
            setPhase('in');
        }, 260);
    };

    const restart = () => {
        setStep(0);
        setCurrentCard(null);
        setPlayedCardIds(new Set());
        setDone(false);
        setPhase('idle');
    };

    if (done) {
        return <JourneyComplete onRestart={restart} onExit={onExit} />;
    }

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto animate-fade-up px-2" style={{ height: '100dvh' }}>
            {/* Sticky header — stays visible while scrolling */}
            <header
                className="flex justify-between items-start pt-4 pb-3 shrink-0 sticky top-0 z-20"
                style={{
                    background: 'linear-gradient(180deg, var(--ink) 60%, rgba(8,3,6,0.85) 90%, transparent)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                }}
            >
                <button
                    onClick={onExit}
                    className="text-mute hover:text-bone text-xs tracking-[0.25em] uppercase font-eyebrow transition-colors"
                    aria-label="יציאה מהמסע"
                >
                    סיום
                </button>
                <div className="text-right">
                    <div
                        className="font-eyebrow text-mute text-[10px] mb-1"
                        aria-live="polite"
                    >
                        STEP {Math.min(step + 1, TOTAL_STEPS)} / {TOTAL_STEPS}
                    </div>
                    <div className={`font-display text-lg leading-none ${accentText(currentStep.accent)}`}>
                        {currentStep.title}
                    </div>
                    <div className="font-eyebrow text-mute text-[9px] mt-1">{currentStep.phaseLabel}</div>
                </div>
            </header>

            {/* Heat bar */}
            <div
                className="heat-track mt-2 mb-6 shrink-0"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="התקדמות המסע"
            >
                <div className="heat-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Card area — scrollable when card is long */}
            <main
                className="flex-grow relative overflow-y-auto overflow-x-hidden custom-scroll"
                style={{
                    paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
                    overscrollBehavior: 'contain',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <div className="min-h-full flex items-start justify-center pt-2 pb-6">
                    {!currentCard ? (
                        <div className="flex items-center justify-center w-full min-h-[60vh]">
                            <DrawSlot onClick={drawCard} accent={currentStep.accent} />
                        </div>
                    ) : (
                        <GameCard
                            card={currentCard}
                            phase={phase}
                            accent={currentStep.accent}
                            onComplete={completeCard}
                            onSwap={swapCard}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

/* -------- Draw slot -------- */
interface DrawSlotProps { onClick: () => void; accent: StepDef['accent']; }
const DrawSlot = ({ onClick, accent }: DrawSlotProps) => (
    <button
        onClick={onClick}
        className={`relative w-64 h-96 rounded-[28px] glass ${accentGlow(accent)} animate-draw-float
            flex flex-col items-center justify-center text-center transition-transform duration-300
            hover:scale-[1.025] active:scale-[0.98]`}
        aria-label="שלוף את הקלף הבא"
    >
        {/* Stacked card shadow */}
        <div className="absolute inset-0 rounded-[28px] border border-hair-2 translate-x-2 translate-y-3 -z-10 opacity-50" />
        <div className="absolute inset-0 rounded-[28px] border border-hair translate-x-4 translate-y-5 -z-20 opacity-25" />

        <div className="font-eyebrow text-mute text-[10px] mb-6">A NEW CARD</div>
        <div className="font-display text-bone text-4xl mb-2">שלוף</div>
        <div className="font-italic text-mute text-base">הקש כדי להתחיל</div>
    </button>
);

/* -------- Game card -------- */
interface GameCardProps {
    card: CardData;
    phase: 'idle' | 'in' | 'out';
    accent: StepDef['accent'];
    onComplete: () => void;
    onSwap: () => void;
}

const GameCard = ({ card, phase, accent, onComplete, onSwap }: GameCardProps) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [showSecretHe, setShowSecretHe] = useState(false);
    const [showSecretShe, setShowSecretShe] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Reset card-level state whenever the card changes
    useEffect(() => {
        setShowDetails(false);
        setShowSecret(false);
        setShowSecretHe(false);
        setShowSecretShe(false);
        setTimeLeft(null);
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, [card.id]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    /** Play a soft "dong" via Web Audio — two-tone bell, ~0.7s decay */
    const playDong = () => {
        try {
            const AC = (window.AudioContext || (window as any).webkitAudioContext);
            if (!AC) return;
            const ctx: AudioContext = new AC();
            const now = ctx.currentTime;
            const tones = [
                { freq: 880, gain: 0.18, dur: 0.7 },
                { freq: 587, gain: 0.13, dur: 0.9 },
            ];
            tones.forEach(({ freq, gain, dur }) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.frequency.value = freq;
                osc.type = 'sine';
                g.gain.setValueAtTime(gain, now);
                g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
                osc.connect(g);
                g.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + dur);
            });
            setTimeout(() => ctx.close(), 1100);
        } catch { /* ignore — silent fallback */ }
    };

    const startTimer = () => {
        if (!card.timer || running) return;
        setTimeLeft(card.timer);
        setRunning(true);
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null) return null;
                if (prev <= 1) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setRunning(false);
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate([180, 100, 220]);
                    }
                    playDong();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const roleLabel =
        card.role === 'MAN'   ? 'עכשיו · רק הוא' :
        card.role === 'WOMAN' ? 'עכשיו · רק היא' :
                                'עכשיו · שניכם';

    const roleSub =
        card.role === 'MAN'   ? 'הוא נותן · היא מקבלת' :
        card.role === 'WOMAN' ? 'היא נותנת · הוא מקבל' :
                                'יחד · אותו רגע';

    const typeLabel =
        card.type === 'TECHNIQUE'   ? 'טכניקה' :
        card.type === 'POSITION'    ? 'תנוחה'  :
        card.type === 'SURPRISE'    ? 'הפתעה'  :
                                      'הוראה';

    const phaseClass =
        phase === 'in'  ? 'opacity-100 translate-y-0 blur-0'   :
        phase === 'out' ? 'opacity-0 -translate-y-3 blur-md'   :
                          'opacity-100 translate-y-0 blur-0';

    const roleGradient =
        card.role === 'MAN'
            ? 'linear-gradient(135deg, rgba(255,138,91,0.20), rgba(245,196,110,0.10))'
            : card.role === 'WOMAN'
            ? 'linear-gradient(135deg, rgba(255,82,119,0.25), rgba(224,43,79,0.10))'
            : 'linear-gradient(135deg, rgba(255,245,237,0.10), rgba(255,245,237,0.04))';

    const roleBorder =
        card.role === 'MAN'   ? 'rgba(255,138,91,0.45)' :
        card.role === 'WOMAN' ? 'rgba(255,82,119,0.55)' :
                                'rgba(255,245,237,0.22)';

    const roleColor =
        card.role === 'MAN'   ? 'var(--ember-soft)' :
        card.role === 'WOMAN' ? 'var(--rose-soft)'  :
                                'var(--bone)';

    return (
        <>
            <article
                className={`glass-deep ${accentGlow(accent)} w-full max-w-sm overflow-hidden
                    transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${phaseClass}`}
                aria-labelledby={`card-title-${card.id}`}
            >
                {/* === ROLE BANNER — big, beautiful, who's giving now === */}
                {!card.isStation && (
                    <div
                        className="px-6 pt-5 pb-4 text-center border-b border-hair word-appear"
                        style={{ background: roleGradient }}
                    >
                        <div
                            className="font-eyebrow text-[10px] mb-1"
                            style={{ color: roleColor, letterSpacing: '0.32em' }}
                        >
                            ✦ {roleLabel} ✦
                        </div>
                        <div className="font-light text-mute text-[12px] tracking-[0.1em]">
                            {roleSub}
                        </div>
                    </div>
                )}
                {card.isStation && (
                    <div className="px-6 pt-5 pb-3 text-center border-b border-hair"
                         style={{ background: 'linear-gradient(135deg, rgba(245,196,110,0.18), rgba(255,138,91,0.08))' }}>
                        <span className="font-eyebrow text-azure text-[10px] tracking-[0.32em]">
                            ◆ תחנה · עצירה חובה ◆
                        </span>
                    </div>
                )}

                {/* Top eyebrow row */}
                <header className="px-6 pt-5 pb-4 border-b border-hair">
                    <div className="flex items-center justify-between mb-3">
                        <span className={`pill ${card.role === 'MAN' ? 'pill-violet' : card.role === 'WOMAN' ? 'pill-rose' : 'pill-azure'}`}>
                            {typeLabel}
                        </span>
                        <span className="font-eyebrow text-mute text-[9px]">{card.sub}</span>
                    </div>
                    <h2
                        id={`card-title-${card.id}`}
                        className="font-display text-bone text-3xl leading-tight mb-1 word-appear word-appear-1"
                    >
                        {card.text}
                    </h2>
                </header>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {/* Description — the action */}
                    <p className="text-bone text-[15px] leading-relaxed text-right word-appear word-appear-3 font-light">
                        {card.desc}
                    </p>

                    {/* Inline steps preview — first 3 lines */}
                    {card.details && (
                        <button
                            onClick={() => setShowDetails(true)}
                            className="w-full rounded-2xl bg-white/[0.03] border border-hair hover:border-hair-2 transition-colors px-4 py-3 text-right group"
                            aria-label="פתח מדריך מפורט"
                        >
                            <div className="font-eyebrow text-mute text-[9px] mb-1">הוראות מלאות</div>
                            <div className="font-italic text-bone text-[15px] leading-snug line-clamp-2 group-hover:text-rose-soft transition-colors">
                                לחצו כאן למדריך הצעד־אחר־צעד &larr;
                            </div>
                        </button>
                    )}

                    {/* Secrets — shown by card role.
                        Role MAN  → only his secret (HE is the giver this turn).
                        Role WOMAN→ only her secret.
                        Role BOTH → both secrets, each side reveals their own. */}
                    {(() => {
                        const sheActive = card.role === 'WOMAN' || card.role === 'BOTH';
                        const heActive  = card.role === 'MAN'   || card.role === 'BOTH';
                        const sheSecret = card.secretShe ?? (card.role === 'WOMAN' ? card.secret : undefined);
                        const heSecret  = card.secretHe  ?? (card.role === 'MAN'   ? card.secret : undefined);
                        const onlyGeneric = !sheSecret && !heSecret && card.secret;

                        return (
                            <>
                                {sheActive && sheSecret && (
                                    showSecretShe ? (
                                        <div
                                            className="rounded-3xl px-5 py-4 text-right border-2 word-appear"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,82,119,0.22), rgba(224,43,79,0.10))',
                                                borderColor: 'rgba(255,82,119,0.55)',
                                                boxShadow: '0 0 30px -8px rgba(255,82,119,0.45)',
                                            }}
                                        >
                                            <div className="font-eyebrow text-rose-soft text-[10px] mb-2 tracking-[0.30em]">
                                                ✦ לה · סוד ✦
                                            </div>
                                            <p className="font-light text-bone text-[16px] leading-relaxed">{sheSecret}</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowSecretShe(true)}
                                            className="w-full rounded-3xl px-5 py-4 text-right border-2 transition-all hover:scale-[1.02] active:scale-[0.99] animate-pulse-glow"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,82,119,0.12), rgba(224,43,79,0.04))',
                                                borderColor: 'rgba(255,82,119,0.50)',
                                            }}
                                            aria-label="חשוף סוד לה"
                                        >
                                            <div className="font-eyebrow text-rose-soft text-[10px] mb-2 tracking-[0.30em]">
                                                ✦ לה · סוד שווה ✦
                                            </div>
                                            <p className="font-accent text-[15px]">היא לוחצת · רגע שלה לקרוא</p>
                                        </button>
                                    )
                                )}
                                {heActive && heSecret && (
                                    showSecretHe ? (
                                        <div
                                            className="rounded-3xl px-5 py-4 text-right border-2 word-appear"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,138,91,0.22), rgba(245,196,110,0.12))',
                                                borderColor: 'rgba(255,138,91,0.55)',
                                                boxShadow: '0 0 30px -8px rgba(255,138,91,0.45)',
                                            }}
                                        >
                                            <div className="font-eyebrow text-violet text-[10px] mb-2 tracking-[0.30em]">
                                                ◆ לו · סוד ◆
                                            </div>
                                            <p className="font-light text-bone text-[16px] leading-relaxed">{heSecret}</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowSecretHe(true)}
                                            className="w-full rounded-3xl px-5 py-4 text-right border-2 transition-all hover:scale-[1.02] active:scale-[0.99]"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,138,91,0.12), rgba(245,196,110,0.04))',
                                                borderColor: 'rgba(255,138,91,0.50)',
                                            }}
                                            aria-label="חשוף סוד לו"
                                        >
                                            <div className="font-eyebrow text-violet text-[10px] mb-2 tracking-[0.30em]">
                                                ◆ לו · סוד שווה ◆
                                            </div>
                                            <p className="font-accent-gold text-[15px]">הוא לוחץ · רגע שלו לקרוא</p>
                                        </button>
                                    )
                                )}
                                {onlyGeneric && (
                                    showSecret ? (
                                        <div
                                            className="rounded-3xl px-5 py-4 text-right border-2 word-appear"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(224,43,79,0.18), rgba(245,196,110,0.12))',
                                                borderColor: 'rgba(245,196,110,0.45)',
                                                boxShadow: '0 0 30px -8px rgba(245,196,110,0.40)',
                                            }}
                                        >
                                            <div className="font-eyebrow text-azure text-[10px] mb-2 tracking-[0.30em]">
                                                ✦ סוד ✦
                                            </div>
                                            <p className="font-light text-bone text-[16px] leading-relaxed">{card.secret}</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowSecret(true)}
                                            className="w-full rounded-3xl px-5 py-4 text-right border-2 transition-all hover:scale-[1.02] active:scale-[0.99]"
                                            style={{ borderColor: 'rgba(245,196,110,0.40)' }}
                                            aria-label="חשוף סוד"
                                        >
                                            <div className="font-eyebrow text-azure text-[10px] mb-2 tracking-[0.30em]">
                                                ✦ סוד נעול ✦
                                            </div>
                                            <p className="font-accent-gold text-[15px]">לחצו · המנגנון מאחורי הקלף</p>
                                        </button>
                                    )
                                )}
                            </>
                        );
                    })()}

                    {/* Circular Timer — beautiful ring that drains slowly, dong at end */}
                    {card.timer && (
                        <CircularTimer
                            duration={card.timer}
                            timeLeft={timeLeft}
                            running={running}
                            onStart={startTimer}
                            formatTime={formatTime}
                        />
                    )}
                </div>

                {/* Footer */}
                <footer className="px-6 pb-6 pt-2 flex flex-col gap-3">
                    <Button onClick={onComplete} aria-label="סיימנו · קלף הבא">
                        סיימנו ·
                    </Button>
                    {!card.isStation && (
                        <button
                            onClick={onSwap}
                            className="font-italic text-mute hover:text-bone transition-colors text-[14px] py-1"
                            aria-label="החלף קלף"
                        >
                            לא מתאים? החליפו קלף
                        </button>
                    )}
                </footer>
            </article>

            {/* Details modal */}
            <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title={card.text}>
                <div className="font-eyebrow text-azure text-[10px] mb-4">המדריך המלא</div>
                <div className="whitespace-pre-line text-bone text-[15px] leading-loose text-right" dir="rtl">
                    {card.details || 'הקשיבו לנשימות של הפרטנר/ית. תנו לאינטואיציה להוביל.'}
                </div>
            </Modal>
        </>
    );
};

/* -------- Circular Timer — SVG ring that drains slowly --------
 * Big readable digits in the center, stroke ring around them.
 * Color shifts from gold → ember → blood as time runs out. */
interface CircularTimerProps {
    duration: number;
    timeLeft: number | null;
    running: boolean;
    onStart: () => void;
    formatTime: (s: number) => string;
}

const CircularTimer = ({ duration, timeLeft, running, onStart, formatTime }: CircularTimerProps) => {
    const SIZE = 132;
    const STROKE = 5;
    const R = (SIZE - STROKE * 2) / 2;
    const C = 2 * Math.PI * R;
    const shown = timeLeft !== null ? timeLeft : duration;
    const pct = timeLeft !== null ? Math.max(0, Math.min(1, timeLeft / duration)) : 1;
    const offset = C * (1 - pct);
    const done = timeLeft === 0;

    // Color shifts as time drains
    const ringColor =
        pct > 0.66 ? 'var(--gold)'  :
        pct > 0.33 ? 'var(--ember)' :
                     'var(--blood)';

    return (
        <button
            onClick={onStart}
            disabled={running}
            className={`mx-auto flex items-center justify-center transition-transform ${running ? '' : 'active:scale-95 hover:scale-[1.03]'} ${done ? 'opacity-90' : ''}`}
            style={{ width: SIZE, height: SIZE, background: 'transparent', border: 'none', cursor: running ? 'default' : 'pointer' }}
            aria-label={running ? 'טיימר פעיל' : 'הפעל טיימר'}
            role="timer"
            aria-live="polite"
        >
            <svg width={SIZE} height={SIZE} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <defs>
                    <filter id="ringGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="b"/>
                        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>
                {/* Track */}
                <circle
                    cx={SIZE/2} cy={SIZE/2} r={R}
                    fill="none"
                    stroke="rgba(255,245,237,0.10)"
                    strokeWidth={STROKE}
                />
                {/* Drain ring */}
                <circle
                    cx={SIZE/2} cy={SIZE/2} r={R}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={offset}
                    style={{
                        transition: 'stroke-dashoffset 1s linear, stroke 1s ease',
                        filter: 'url(#ringGlow)',
                    }}
                />
            </svg>
            <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="font-eyebrow text-mute text-[9px] mb-1">
                    {done ? '✦ סיימנו ✦' : running ? 'בעיצומו' : '◆ טיימר'}
                </div>
                <div
                    className="font-mark text-bone text-3xl tabular-nums"
                    style={{ fontWeight: 300, letterSpacing: '0.02em' }}
                >
                    {done ? '✓' : formatTime(shown)}
                </div>
                {!running && timeLeft === null && (
                    <div className="font-light text-faint text-[10px] mt-1">לחצו להפעלה</div>
                )}
            </div>
        </button>
    );
};

/* -------- Journey complete screen -------- */
const JourneyComplete = ({ onRestart, onExit }: { onRestart: () => void; onExit: () => void }) => (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto animate-fade-up text-center px-4">
        <div className="font-eyebrow text-mute text-[10px] mb-3">FINIS</div>
        <h2 className="font-display text-bone text-5xl mb-3 shimmer-text">סיימנו</h2>
        <p className="font-italic text-mute text-lg mb-10">
            רגע אחרי — חיבוק. תודה. מילה רכה.<br/>
            ה־aftercare הוא חצי מהקסם.
        </p>
        <div className="w-full max-w-[260px] space-y-3">
            <Button onClick={onRestart}>מסע חדש</Button>
            <Button variant="ghost" onClick={onExit}>חזרה לתפריט</Button>
        </div>
    </div>
);
