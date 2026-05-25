import React, { useState } from 'react';
import { SCENARIOS } from '../data/content';
import { Button } from './UI';
import { ScenarioData } from '../types';

interface ScenarioProps {
    onExit: () => void;
}

export const Scenario: React.FC<ScenarioProps> = ({ onExit }) => {
    const [scenario, setScenario] = useState<ScenarioData | null>(null);
    const [loading, setLoading] = useState(false);

    const roll = () => {
        setLoading(true);
        setScenario(null);
        setTimeout(() => {
            const s = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
            setScenario(s);
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto animate-fade-up px-2">
            <header className="flex justify-between items-start pt-4 pb-3">
                <button
                    onClick={onExit}
                    className="text-mute hover:text-bone text-xs tracking-[0.25em] uppercase font-eyebrow"
                    aria-label="חזרה לתפריט"
                >
                    סיום
                </button>
                <div className="text-right">
                    <div className="font-eyebrow text-mute text-[10px] mb-1">SCENARIO</div>
                    <h1 className="font-display text-bone text-2xl leading-none">תרחיש</h1>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center text-center py-6">
                {!scenario && !loading && (
                    <div className="animate-fade-up w-full max-w-[300px]">
                        <p className="font-italic text-mute text-lg mb-2">דמיון, דמויות, גבול אחד</p>
                        <h2 className="font-display text-bone text-4xl mb-8 shimmer-text">בחירה אקראית</h2>
                        <Button onClick={roll}>הגרילו תרחיש</Button>
                    </div>
                )}

                {loading && (
                    <div className="animate-fade-up text-center">
                        <div className="font-eyebrow text-rose-soft text-[10px] mb-3">SELECTING</div>
                        <div className="font-italic text-bone text-2xl animate-pulse">בוחרים תרחיש…</div>
                    </div>
                )}

                {scenario && !loading && (
                    <article
                        className="glass-deep glow-rose w-full max-w-sm animate-fade-up text-right overflow-hidden"
                        dir="rtl"
                    >
                        <header className="px-6 pt-6 pb-4 border-b border-hair text-center">
                            <div className="font-eyebrow text-rose-soft text-[10px] mb-2">תרחיש</div>
                            <h2 className="font-display text-bone text-3xl leading-tight">{scenario.title}</h2>
                            <div className="mt-3 flex items-center justify-center gap-3">
                                <span className="pill pill-violet">{scenario.roles[0]}</span>
                                <span className="font-italic text-mute text-sm">·</span>
                                <span className="pill pill-rose">{scenario.roles[1]}</span>
                            </div>
                        </header>

                        <div className="px-6 py-5 space-y-4">
                            <div className="rounded-2xl bg-white/[0.03] border border-hair px-4 py-3">
                                <div className="font-eyebrow text-azure text-[9px] mb-1">מיקום</div>
                                <p className="text-bone text-[15px]">{scenario.loc}</p>
                            </div>
                            <div className="rounded-2xl border px-4 py-3"
                                style={{ background: 'linear-gradient(135deg, rgba(224,43,79,0.10), transparent)', borderColor: 'rgba(224,43,79,0.32)' }}>
                                <div className="font-eyebrow text-rose-soft text-[9px] mb-1">הכלל</div>
                                <p className="text-bone text-[15px]">{scenario.rule}</p>
                            </div>
                            <div className="rounded-2xl bg-white/[0.03] border border-hair px-4 py-3">
                                <div className="font-eyebrow text-violet text-[9px] mb-2">צעדים</div>
                                <ol className="space-y-2 text-bone text-[14px] leading-relaxed list-decimal pr-4">
                                    {scenario.steps.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        <footer className="px-6 pb-6 pt-2">
                            <Button onClick={roll}>תרחיש אחר</Button>
                        </footer>
                    </article>
                )}
            </main>
        </div>
    );
};
