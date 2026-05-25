import React, { useState, useRef, useEffect } from 'react';
import { Button } from './UI';

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

    const handleLogin = () => {
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

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto animate-fade-up">
            <div className="font-italic text-mute text-base mb-3 tracking-wider">בין שניכם</div>
            <h1 className="font-display text-7xl text-center leading-[0.95] mb-1 shimmer-text">
                INTIMACY
            </h1>
            <p className="font-eyebrow text-mute text-[10px] mb-12">A PRIVATE RITUAL</p>

            <div className="w-full max-w-[260px] mb-7">
                <label htmlFor="pin" className="sr-only">קוד גישה</label>
                <input
                    id="pin"
                    ref={inputRef}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    placeholder="—  —  —  —"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={onKeyDown}
                    disabled={locked}
                    aria-label="קוד גישה בן 4 ספרות"
                    aria-invalid={error}
                    className={`w-full glass px-4 py-5 text-center text-3xl tracking-[0.8em] focus:outline-none text-bone font-display transition-all
                        ${error ? 'glow-rose' : 'border-hair-2'}
                        ${locked ? 'opacity-40' : ''}
                        placeholder:text-mute placeholder:tracking-[0.5em]`}
                />
            </div>

            <div className="w-full max-w-[260px]">
                <Button onClick={handleLogin} disabled={locked} aria-label="כניסה">
                    {locked ? 'ננעל — המתן' : 'הכניסה שלנו'}
                </Button>
            </div>

            <p
                className="font-eyebrow text-rose-soft text-[10px] mt-5 h-4"
                role="alert"
                aria-live="polite"
            >
                {error && !locked ? 'קוד שגוי' : locked ? 'נחסם ל-30 שניות' : ' '}
            </p>
        </div>
    );
};
