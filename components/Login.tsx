import React, { useState, useRef, useEffect } from 'react';

interface LoginProps {
    onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [locked, setLocked] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const submit = () => {
        if (locked) return;
        if (pin === '1900') {
            onSuccess();
        } else {
            setError(true);
            setPin('');
            const next = attempts + 1;
            setAttempts(next);
            if (next >= 3) {
                setLocked(true);
                setTimeout(() => { setLocked(false); setAttempts(0); }, 30000);
            }
            setTimeout(() => setError(false), 800);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto px-6 screen-fade">
            {/* Tiny divider */}
            <div className="divider-spark w-24 mb-6 word-appear word-appear-1">
                <span>✦</span>
            </div>

            {/* Mark — Plus Jakarta Sans ultra-light, modern web feel */}
            <h1
                className="font-mark text-bone text-[3.2rem] leading-none mb-4 word-appear word-appear-2"
                style={{ letterSpacing: '0.28em', textIndent: '0.28em', fontWeight: 200 }}
            >
                INTIMACY
            </h1>

            <p className="font-accent text-xl mb-2 word-appear word-appear-3">
                ◆ רק שניכם ◆
            </p>
            <p className="text-faint text-sm mb-14 word-appear word-appear-3">
                כל מה שתעשו פה — נשאר פה
            </p>

            {/* PIN input */}
            <div className="w-full max-w-[280px] mb-7 word-appear word-appear-4">
                <label htmlFor="pin" className="sr-only">קוד גישה</label>
                <input
                    id="pin"
                    ref={inputRef}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    placeholder="·  ·  ·  ·"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    disabled={locked}
                    aria-label="קוד גישה בן 4 ספרות"
                    aria-invalid={error}
                    className={`w-full text-center text-2xl text-bone py-4 px-4 bg-transparent
                        border-b transition-all outline-none
                        ${error ? 'border-b-2' : ''}
                        ${locked ? 'opacity-40' : ''}
                        placeholder:text-faint placeholder:tracking-[0.5em]`}
                    style={{
                        borderColor: error ? 'var(--blood)' : 'var(--hair-2)',
                        letterSpacing: '0.7em',
                        fontWeight: 300,
                    }}
                />
            </div>

            {/* Submit */}
            <div className="w-full max-w-[280px] word-appear word-appear-5">
                <button
                    onClick={submit}
                    disabled={locked}
                    className="action-btn"
                    aria-label="כניסה"
                >
                    {locked ? 'ננעל · המתן' : 'הכניסה שלנו'}
                </button>
            </div>

            {/* Error / lock state */}
            <p
                className="text-rose-soft text-[11px] mt-6 h-4 font-light tracking-[0.18em]"
                role="alert"
                aria-live="polite"
            >
                {error && !locked ? 'קוד שגוי' : locked ? 'נחסם ל-30 שניות' : ' '}
            </p>

            {/* Footer hint */}
            <p className="font-light text-faint text-[11px] mt-auto pt-12 word-appear word-appear-6 tracking-[0.18em]">
                vol. ii ✦ crimson ritual
            </p>
        </div>
    );
};
