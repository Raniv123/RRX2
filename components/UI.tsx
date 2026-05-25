import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost';
}

export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
    const cls = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
    return (
        <button className={`${cls} ${className}`} {...props}>
            {children}
        </button>
    );
};

interface SvgIconProps {
    path: string;
    color?: string;
    className?: string;
}

export const SvgIcon = ({ path, color = '#f5ecff', className = '' }: SvgIconProps) => (
    <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${className}`}
        aria-hidden="true"
        role="img"
    >
        <defs>
            <linearGradient id={`g-${color.replace('#','')}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"  stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ff3d8a" />
                <stop offset="100%" stopColor="#5b8cff" />
            </linearGradient>
        </defs>
        <path
            d={path}
            stroke={`url(#g-${color.replace('#','')})`}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 6px rgba(168,85,247,0.55))` }}
        />
    </svg>
);

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div
                className="absolute inset-0 bg-black/85 backdrop-blur-md animate-fade-up"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className="relative glass-deep w-full max-w-sm max-h-[82vh] flex flex-col animate-fade-up overflow-hidden"
                dir="rtl"
            >
                <div className="px-6 pt-6 pb-4 flex justify-between items-start border-b border-hair">
                    <h3 className="font-display text-2xl text-bone leading-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        aria-label="סגור"
                        className="text-mute hover:text-bone text-2xl leading-none w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-white/5"
                    >
                        &times;
                    </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto text-bone leading-loose text-[15px] custom-scroll">
                    {children}
                </div>
                <div className="px-6 pb-6 pt-3">
                    <Button variant="ghost" onClick={onClose}>סגור</Button>
                </div>
            </div>
        </div>
    );
};
