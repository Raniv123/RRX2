import React, { useState, useRef, useEffect } from 'react';
import { Button } from './UI';

interface DiceProps {
    onExit: () => void;
}

const DATA = {
    actions: ['נשק', 'לקק', 'גע', 'נשוף', 'נשוך קלות', 'עסה', 'רטט'],
    parts:   ['צוואר', 'שפתיים', 'אוזן', 'ירכיים פנימיות', 'חזה', 'כפות ידיים', 'בטן תחתונה'],
    twists:  ['בעדינות', 'חזק', 'לאט מאוד', 'עם קרח', 'עם עיניים מכוסות', 'בלי ידיים', '30 שניות עצור']
};

const SLOTS: Array<{ key: 'actions' | 'parts' | 'twists'; label: string; eyebrow: string; accent: 'rose' | 'violet' | 'azure'; }> = [
    { key: 'actions', label: 'פעולה',    eyebrow: 'ACTION',  accent: 'rose'   },
    { key: 'parts',   label: 'איבר בגוף', eyebrow: 'TARGET',  accent: 'violet' },
    { key: 'twists',  label: 'טוויסט',    eyebrow: 'TWIST',   accent: 'azure'  },
];

export const Dice: React.FC<DiceProps> = ({ onExit }) => {
    const [slots, setSlots] = useState<[string, string, string]>(['—', '—', '—']);
    const [rolling, setRolling] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

    const roll = () => {
        if (rolling) return;
        setRolling(true);
        let count = 0;
        intervalRef.current = setInterval(() => {
            setSlots([
                DATA.actions[Math.floor(Math.random() * DATA.actions.length)],
                DATA.parts[Math.floor(Math.random() * DATA.parts.length)],
                DATA.twists[Math.floor(Math.random() * DATA.twists.length)]
            ]);
            count++;
            if (count > 16) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = null;
                setRolling(false);
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(80);
            }
        }, 80);
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
                    <div className="font-eyebrow text-mute text-[10px] mb-1">CHANCE</div>
                    <h1 className="font-display text-bone text-2xl leading-none">הקוביה</h1>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center pb-4">
                <p className="font-italic text-mute text-lg mb-1 text-center">שלוש קוביות, רעיון אחד</p>
                <h2 className="font-display text-bone text-3xl mb-8 text-center shimmer-text">פשוט תזרקו</h2>

                <div className="w-full max-w-[320px] space-y-3 mb-8">
                    {SLOTS.map((slot, i) => (
                        <Slot
                            key={slot.key}
                            eyebrow={slot.eyebrow}
                            label={slot.label}
                            value={slots[i]}
                            accent={slot.accent}
                            rolling={rolling}
                        />
                    ))}
                </div>

                <div className="w-full max-w-[280px]">
                    <Button onClick={roll} disabled={rolling} aria-label="זרוק קוביות">
                        {rolling ? 'מתגלגל…' : 'זרקו את הקוביות'}
                    </Button>
                </div>
            </main>
        </div>
    );
};

const Slot = ({
    eyebrow, label, value, accent, rolling,
}: {
    eyebrow: string;
    label: string;
    value: string;
    accent: 'rose' | 'violet' | 'azure';
    rolling: boolean;
}) => {
    const accentText =
        accent === 'rose'   ? 'text-rose-soft' :
        accent === 'violet' ? 'text-violet'    : 'text-azure';
    const glow =
        accent === 'rose'   ? 'glow-rose'   :
        accent === 'violet' ? 'glow-violet' : 'glow-azure';

    return (
        <div className={`glass ${glow} px-5 py-4 text-right transition-all ${rolling ? 'opacity-90' : 'opacity-100'}`}>
            <div className="flex items-center justify-between">
                <div className="font-eyebrow text-mute text-[9px]">{eyebrow}</div>
                <div className="font-eyebrow text-mute text-[9px]">{label}</div>
            </div>
            <div className={`font-display ${accentText} text-3xl leading-tight mt-1`}>{value}</div>
        </div>
    );
};
