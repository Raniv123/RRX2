import React, { useState, useRef, useEffect } from 'react';
import { Button, SvgIcon } from './UI';
import { TIPS_MALE, TIPS_FEMALE } from '../data/content';
import { TipData } from '../types';

interface TipsProps {
    onExit: () => void;
}

type Access = 'NONE' | 'MALE' | 'FEMALE';

export const Tips: React.FC<TipsProps> = ({ onExit }) => {
    const [pin, setPin] = useState('');
    const [access, setAccess] = useState<Access>('NONE');
    const [error, setError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { if (access === 'NONE') inputRef.current?.focus(); }, [access]);

    const onSubmit = () => {
        if (pin === '5888')      setAccess('MALE');
        else if (pin === '1900') setAccess('FEMALE');
        else {
            setError(true);
            setPin('');
            setTimeout(() => setError(false), 800);
        }
    };

    if (access === 'NONE') {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto animate-fade-up text-center px-4">
                <button
                    onClick={onExit}
                    className="absolute top-6 right-6 text-mute hover:text-bone text-xs tracking-[0.25em] uppercase font-eyebrow"
                    aria-label="חזרה לתפריט"
                >
                    סיום
                </button>

                <div className="font-eyebrow text-mute text-[10px] mb-3">INNER CIRCLE</div>
                <h1 className="font-display text-5xl text-center leading-[0.95] mb-1 shimmer-text">הסודות</h1>
                <p className="font-italic text-mute text-base mb-10">מי כאן? קוד אחר לכל אחד.</p>

                <div className="w-full max-w-[260px] mb-7">
                    <label htmlFor="tipspin" className="sr-only">קוד גישה</label>
                    <input
                        id="tipspin"
                        ref={inputRef}
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        placeholder="—  —  —  —"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                        aria-label="קוד גישה"
                        aria-invalid={error}
                        className={`w-full glass px-4 py-5 text-center text-3xl tracking-[0.8em] focus:outline-none text-bone font-display transition-all
                            ${error ? 'glow-rose' : 'border-hair-2'}
                            placeholder:text-mute placeholder:tracking-[0.5em]`}
                    />
                </div>
                <div className="w-full max-w-[260px]">
                    <Button onClick={onSubmit}>פתחו את התיק</Button>
                </div>
                <p className="font-eyebrow text-rose-soft text-[10px] mt-5 h-4" role="alert" aria-live="polite">
                    {error ? 'קוד שגוי' : ' '}
                </p>
            </div>
        );
    }

    const tips = access === 'MALE' ? TIPS_MALE : TIPS_FEMALE;
    const eyebrow = access === 'MALE' ? 'FOR HIS EYES ONLY' : 'FOR HER EYES ONLY';
    const sub     = access === 'MALE' ? 'איך לענג אותה' : 'איך לענג אותו';
    const accent  = access === 'MALE' ? 'violet' as const : 'rose' as const;

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto animate-fade-up px-2">
            <header className="flex justify-between items-start pt-4 pb-3 border-b border-hair">
                <button
                    onClick={onExit}
                    className="text-mute hover:text-bone text-xs tracking-[0.25em] uppercase font-eyebrow"
                    aria-label="חזרה לתפריט"
                >
                    סיום
                </button>
                <div className="text-right">
                    <div className="font-eyebrow text-mute text-[10px] mb-1">{eyebrow}</div>
                    <h1 className="font-display text-bone text-2xl leading-none">הסודות</h1>
                    <div className="font-italic text-mute text-sm mt-1">{sub}</div>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto custom-scroll py-5 space-y-4 px-1">
                {tips.map((tip) => (
                    <TipCard key={tip.id} tip={tip} accent={accent} />
                ))}
                <div className="h-6"></div>
            </div>
        </div>
    );
};

const TipCard: React.FC<{ tip: TipData; accent: 'violet' | 'rose' }> = ({ tip, accent }) => {
    const glow = accent === 'violet' ? 'glow-violet' : 'glow-rose';
    return (
        <article className={`glass ${glow} px-5 py-4 text-right`} dir="rtl">
            <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 shrink-0 opacity-90">
                    <SvgIcon path={tip.icon} />
                </div>
                <div className="flex-1">
                    <div className={`font-eyebrow text-[9px] mb-1 ${accent === 'violet' ? 'text-violet' : 'text-rose-soft'}`}>
                        TIP {String(tip.id).padStart(2, '0')}
                    </div>
                    <h3 className="font-display text-bone text-xl leading-tight">{tip.title}</h3>
                </div>
            </div>
            <p className="text-bone text-[14px] leading-relaxed">{tip.content}</p>
        </article>
    );
};
