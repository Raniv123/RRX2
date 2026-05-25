import React, { useState } from 'react';
import { Login } from './components/Login';
import { Menu } from './components/Menu';
import { Journey } from './components/Journey';
import { Scenario } from './components/Scenario';
import { Tips } from './components/Tips';
import { Dice } from './components/Dice';
import { Screen } from './types';

function App() {
    const [screen, setScreen] = useState<Screen>('LOGIN');

    const renderScreen = () => {
        switch (screen) {
            case 'LOGIN':
                return <Login onSuccess={() => setScreen('MENU')} />;
            case 'MENU':
                return <Menu onSelect={setScreen} />;
            case 'JOURNEY':
                return <Journey onExit={() => setScreen('MENU')} />;
            case 'SCENARIO':
                return <Scenario onExit={() => setScreen('MENU')} />;
            case 'DICE':
                return <Dice onExit={() => setScreen('MENU')} />;
            case 'TIPS':
                return <Tips onExit={() => setScreen('MENU')} />;
            default:
                return <Login onSuccess={() => setScreen('MENU')} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-slate-200">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-fuchsia-600/10 blur-[100px] rounded-full animate-pulse-glow"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full p-4 h-screen flex flex-col">
                {renderScreen()}
            </div>
        </div>
    );
}

export default App;