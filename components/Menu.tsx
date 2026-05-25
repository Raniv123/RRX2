import React from 'react';
import { Screen } from '../types';

interface MenuProps {
    onSelect: (mode: Screen) => void;
}

interface Tile {
    screen: Screen;
    eyebrow: string;
    title: string;
    italic: string;
    glow: 'rose' | 'violet' | 'azure' | 'bone';
    big?: boolean;
}

const TILES: Tile[] = [
    {
        screen: 'JOURNEY',
        eyebrow: 'THE MAIN RITUAL',
        title: 'המסע',
        italic: 'מ-foreplay עד שיא — שבעה־עשר צעדים',
        glow: 'rose',
        big: true,
    },
    {
        screen: 'SCENARIO',
        eyebrow: 'ROLEPLAY',
        title: 'תרחישים',
        italic: 'דמויות, כללים, מקומות',
        glow: 'violet',
    },
    {
        screen: 'DICE',
        eyebrow: 'CHANCE',
        title: 'הקוביה',
        italic: 'אקראי וחד',
        glow: 'azure',
    },
    {
        screen: 'TIPS',
        eyebrow: 'INNER CIRCLE',
        title: 'הסודות',
        italic: 'מה לעשות כדי שתגמרו ביחד',
        glow: 'bone',
    },
];

const Tile = ({ tile, onClick }: { tile: Tile; onClick: () => void }) => {
    const glowCls =
        tile.glow === 'rose'   ? 'glow-rose'   :
        tile.glow === 'violet' ? 'glow-violet' :
        tile.glow === 'azure'  ? 'glow-azure'  : 'glow-soft';

    const accentText =
        tile.glow === 'rose'   ? 'text-rose-soft' :
        tile.glow === 'violet' ? 'text-violet'    :
        tile.glow === 'azure'  ? 'text-azure'     : 'text-mute';

    return (
        <button
            onClick={onClick}
            aria-label={tile.title}
            className={`glass ${glowCls} text-right w-full transition-transform duration-300 ease-out hover:scale-[1.015] active:scale-[0.99]
                ${tile.big ? 'p-7 md:p-8' : 'p-5'}`}
        >
            <div className="flex flex-col gap-2">
                <span className={`font-eyebrow text-[10px] ${accentText}`}>{tile.eyebrow}</span>
                <span className={`font-display text-bone leading-tight ${tile.big ? 'text-5xl' : 'text-3xl'}`}>
                    {tile.title}
                </span>
                <span className="font-italic text-mute text-base leading-snug">
                    {tile.italic}
                </span>
            </div>
        </button>
    );
};

export const Menu: React.FC<MenuProps> = ({ onSelect }) => {
    return (
        <div className="flex flex-col w-full max-w-md mx-auto h-full pt-8 pb-10 px-1 animate-fade-up overflow-y-auto custom-scroll">
            {/* Header */}
            <div className="mb-8">
                <p className="font-eyebrow text-mute text-[10px] mb-2">A PRIVATE RITUAL</p>
                <h1 className="font-display text-5xl leading-none mb-2 shimmer-text">
                    הערב שלנו
                </h1>
                <p className="font-italic text-mute text-lg">
                    בחרו איך מתחילים — אין דרך לא נכונה.
                </p>
            </div>

            {/* Main tile */}
            <div className="mb-5">
                <Tile tile={TILES[0]} onClick={() => onSelect(TILES[0].screen)} />
            </div>

            {/* Two-column row */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                <Tile tile={TILES[1]} onClick={() => onSelect(TILES[1].screen)} />
                <Tile tile={TILES[2]} onClick={() => onSelect(TILES[2].screen)} />
            </div>

            {/* Bottom tile */}
            <Tile tile={TILES[3]} onClick={() => onSelect(TILES[3].screen)} />

            <div className="mt-auto pt-10 text-center">
                <p className="font-eyebrow text-mute text-[9px]">VOL. II · PRIVATE EDITION</p>
            </div>
        </div>
    );
};
