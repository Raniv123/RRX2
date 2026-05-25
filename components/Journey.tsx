import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CARDS } from '../data/content';
import { CardData } from '../types';
import { Button, Modal } from './UI';

interface JourneyProps {
    onExit: () => void;
}

/** 19 steps (0..18) — every step has a deterministic, non-empty pool.
 * Extra steps 3 and 5 are dedicated to her warm-up (per Nagoski:
 * women need 15-25 minutes of foreplay for full arousal).
 */
const TOTAL_STEPS = 19;

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
        filter: c => c.filter(x => x.phase === 'FOREPLAY' && (x.type === 'SURPRISE' || x.id === 104)),
    },
    { // 3 — ⭐ NEW: He warms her up (gentle), per Nagoski's "accelerator" pattern
        title: 'הוא מחמם · עדין',
        phase: 'FOREPLAY',
        phaseLabel: 'PHASE I · FOREPLAY',
        accent: 'ember',
        filter: c => c.filter(x => x.phase === 'FOREPLAY' && x.role === 'MAN' && x.level <= 1),
        fallbackId: 103,
    },
    { // 4 — Intense touch (level 2)
        title: 'מגע אינטנסיבי',
        phase: 'FOREPLAY',
        phaseLabel: 'PHASE I · FOREPLAY',
        accent: 'ember',
        filter: c => c.filter(x => x.phase === 'FOREPLAY' && x.level === 2 && x.role !== 'WOMAN'),
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
    { // 7 — Her turn 1:20
        title: 'היא נותנת · ידיים ופה',
        phase: 'HEAT',
        phaseLabel: 'PHASE II · HEAT',
        accent: 'rose',
        filter: c => c.filter(x => x.phase === 'HEAT' && x.role === 'WOMAN' && x.timer === 80),
    },
    { // 8 — His tease 2:00
        title: 'הוא מחמם',
        phase: 'HEAT',
        phaseLabel: 'PHASE II · HEAT',
        accent: 'rose',
        filter: c => c.filter(x => x.phase === 'HEAT' && x.role === 'MAN' && x.timer === 120),
    },
    { // 9 — His oral 2:35
        title: 'הוא יורד',
        phase: 'HEAT',
        phaseLabel: 'PHASE II · HEAT',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'HEAT' && x.role === 'MAN' && x.timer === 155),
    },
    { // 10 — 69
        title: 'הדדי · 69',
        phase: '69',
        phaseLabel: 'PHASE III · 69',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === '69'),
    },
    { // 11 — Station 2
        title: 'תחנה II · הסנטימטר הקדוש',
        phase: 'TRANSITION',
        phaseLabel: 'STATION II',
        accent: 'bone',
        filter: c => c.filter(x => x.id === 800),
        fallbackId: 800,
    },
    { // 12 — Friction
        title: 'תשוקה · בלי חדירה',
        phase: 'TRANSITION',
        phaseLabel: 'TRANSITION',
        accent: 'blood',
        filter: c => c.filter(x => x.id === 801 || x.id === 802),
    },
    { // 13 — Position 1
        title: 'תנוחה I · עמוקה',
        phase: 'POSITIONS',
        phaseLabel: 'PHASE IV · POSITIONS',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'POSITIONS' && x.level === 4),
    },
    { // 14 — Position 2
        title: 'תנוחה II · אינטימית',
        phase: 'POSITIONS',
        phaseLabel: 'PHASE IV · POSITIONS',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'POSITIONS' && x.level === 4),
    },
    { // 15 — Position 3
        title: 'תנוחה III · ייחודית',
        phase: 'POSITIONS',
        phaseLabel: 'PHASE IV · POSITIONS',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'POSITIONS' && x.level >= 4),
    },
    { // 16 — Position 4 / Climax
        title: 'תנוחה IV · שיא',
        phase: 'POSITIONS',
        phaseLabel: 'PHASE IV · POSITIONS',
        accent: 'blood',
        filter: c => c.filter(x => x.phase === 'POSITIONS' && x.level === 5),
    },
    { // 17 — Edging
        title: 'הגלישה',
        phase: 'FINALE',
        phaseLabel: 'FINALE',
        accent: 'bone',
        filter: c => c.filter(x => x.id === 501),
        fallbackId: 501,
    },
    { // 18 — Release
        title: 'השחרור',
        phase: 'FINALE',
        phaseLabel: 'FINALE',
        accent: 'bone',
        filter: c => c.filter(x => x.id === 504),
        fallbackId: 504,
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
        <div className="flex flex-col h-full w-full max-w-md mx-auto animate-fade-up px-2">
            {/* Header */}
            <header className="flex justify-between items-start pt-4 pb-3">
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
                className="heat-track mt-2 mb-8"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="התקדמות המסע"
            >
                <div className="heat-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Card area */}
            <main className="flex-grow flex items-center justify-center relative pb-4">
                {!currentCard ? (
                    <DrawSlot onClick={drawCard} accent={currentStep.accent} />
                ) : (
                    <GameCard
                        card={currentCard}
                        phase={phase}
                        accent={currentStep.accent}
                        onComplete={completeCard}
                        onSwap={swapCard}
                    />
                )}
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
        card.role === 'MAN'   ? 'הוא נותן · היא מקבלת' :
        card.role === 'WOMAN' ? 'היא נותנת · הוא מקבל' :
                                'שניכם · יחד';

    const typeLabel =
        card.type === 'TECHNIQUE'   ? 'טכניקה' :
        card.type === 'POSITION'    ? 'תנוחה'  :
        card.type === 'SURPRISE'    ? 'הפתעה'  :
                                      'הוראה';

    const phaseClass =
        phase === 'in'  ? 'opacity-100 translate-y-0 blur-0'   :
        phase === 'out' ? 'opacity-0 -translate-y-3 blur-md'   :
                          'opacity-100 translate-y-0 blur-0';

    return (
        <>
            <article
                className={`glass-deep ${accentGlow(accent)} w-full max-w-sm overflow-hidden
                    transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${phaseClass}`}
                aria-labelledby={`card-title-${card.id}`}
            >
                {/* Top eyebrow row */}
                <header className="px-6 pt-6 pb-4 border-b border-hair">
                    <div className="flex items-center justify-between mb-3">
                        {card.isStation ? (
                            <span className="pill pill-bone">תחנה · עצירה</span>
                        ) : (
                            <span className={`pill ${card.role === 'MAN' ? 'pill-violet' : card.role === 'WOMAN' ? 'pill-rose' : 'pill-azure'}`}>
                                {typeLabel}
                            </span>
                        )}
                        <span className="font-eyebrow text-mute text-[9px]">{card.sub}</span>
                    </div>
                    <h2
                        id={`card-title-${card.id}`}
                        className="font-display text-bone text-3xl leading-tight mb-1"
                    >
                        {card.text}
                    </h2>
                    {!card.isStation && (
                        <p className="font-italic text-mute text-base">{roleLabel}</p>
                    )}
                </header>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {/* Description — the action */}
                    <p className="text-bone text-[15px] leading-relaxed text-right">
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

                    {/* Secrets — gender-specific or generic, each side reveals their own */}
                    {card.secretShe && (
                        showSecretShe ? (
                            <div
                                className="rounded-2xl px-4 py-3 text-right border"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,82,119,0.18), rgba(224,43,79,0.08))',
                                    borderColor: 'rgba(255,82,119,0.40)',
                                }}
                            >
                                <div className="font-eyebrow text-rose-soft text-[9px] mb-1">סוד · לה</div>
                                <p className="font-italic text-bone text-[15px] leading-relaxed">{card.secretShe}</p>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowSecretShe(true)}
                                className="w-full rounded-2xl px-4 py-3 text-right border transition-all hover:bg-white/[0.04]"
                                style={{ borderColor: 'rgba(255,82,119,0.30)' }}
                                aria-label="חשוף סוד לה"
                            >
                                <div className="font-eyebrow text-rose-soft text-[9px] mb-1">סוד · לה</div>
                                <p className="font-italic text-mute text-[14px]">היא לוחצת — בתורה</p>
                            </button>
                        )
                    )}
                    {card.secretHe && (
                        showSecretHe ? (
                            <div
                                className="rounded-2xl px-4 py-3 text-right border"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,138,91,0.18), rgba(245,196,110,0.10))',
                                    borderColor: 'rgba(255,138,91,0.40)',
                                }}
                            >
                                <div className="font-eyebrow text-violet text-[9px] mb-1">סוד · לו</div>
                                <p className="font-italic text-bone text-[15px] leading-relaxed">{card.secretHe}</p>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowSecretHe(true)}
                                className="w-full rounded-2xl px-4 py-3 text-right border transition-all hover:bg-white/[0.04]"
                                style={{ borderColor: 'rgba(255,138,91,0.30)' }}
                                aria-label="חשוף סוד לו"
                            >
                                <div className="font-eyebrow text-violet text-[9px] mb-1">סוד · לו</div>
                                <p className="font-italic text-mute text-[14px]">הוא לוחץ — בתורו</p>
                            </button>
                        )
                    )}
                    {card.secret && !card.secretShe && !card.secretHe && (
                        showSecret ? (
                            <div
                                className="rounded-2xl px-4 py-3 text-right border"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(224,43,79,0.15), rgba(245,196,110,0.10))',
                                    borderColor: 'rgba(245,196,110,0.32)',
                                }}
                            >
                                <div className="font-eyebrow text-azure text-[9px] mb-1">סוד</div>
                                <p className="font-italic text-bone text-[15px] leading-relaxed">{card.secret}</p>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowSecret(true)}
                                className="w-full rounded-2xl px-4 py-3 text-right border border-hair-2 hover:bg-white/[0.04] transition-all"
                                aria-label="חשוף סוד"
                            >
                                <div className="font-eyebrow text-azure text-[9px] mb-1">סוד נעול</div>
                                <p className="font-italic text-mute text-[14px]">לחצו לחשיפת המנגנון מאחורי הקלף</p>
                            </button>
                        )
                    )}

                    {/* Timer */}
                    {card.timer && (
                        <button
                            onClick={startTimer}
                            disabled={running}
                            className={`w-full rounded-full px-4 py-3 border transition-all flex items-center justify-center gap-3
                                ${running ? 'border-hair-2 bg-white/[0.04]' : 'border-hair hover:border-hair-2 hover:bg-white/[0.04]'}`}
                            aria-label="הפעל טיימר"
                            role="timer"
                            aria-live="polite"
                        >
                            <span className="font-eyebrow text-mute text-[9px]">{running ? 'בעיצומו' : 'טיימר'}</span>
                            <span className="font-display text-bone text-2xl tabular-nums">
                                {timeLeft !== null ? (timeLeft === 0 ? 'הסתיים' : formatTime(timeLeft)) : formatTime(card.timer)}
                            </span>
                        </button>
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
