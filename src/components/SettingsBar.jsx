import { ArrowLeftRight } from 'lucide-react';
import { PROFILES } from '../utils/constants';

export default function SettingsBar({ direction, profile, onToggleDirection, onProfileChange }) {
  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-none p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
      <div className="flex items-center space-x-2 w-full md:w-auto">
        <span className="text-2xl">{direction === 'RU_TO_EN' ? '🇷🇺' : '🇺🇸'}</span>
        <span className="font-bold text-xs uppercase tracking-widest text-neutral-400">
          {direction === 'RU_TO_EN' ? 'Russian' : 'English'}
        </span>
        <button onClick={onToggleDirection} className="mx-3 p-2 bg-neutral-900 hover:bg-yellow-400 text-neutral-400 hover:text-black rounded-none border border-neutral-800 transition-all" title="Swap Direction">
          <ArrowLeftRight className="h-3.5 w-3.5" />
        </button>
        <span className="text-2xl">{direction === 'RU_TO_EN' ? '🇺🇸' : '🇷🇺'}</span>
        <span className="font-bold text-xs uppercase tracking-widest text-neutral-400">
          {direction === 'RU_TO_EN' ? 'English' : 'Russian'}
        </span>
      </div>
      <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto scrollbar-none py-1">
        <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest hidden md:inline">Research Path:</span>
        {PROFILES.map(p => (
          <button key={p.id} onClick={() => onProfileChange(p.id)} className={`px-3 py-1.5 rounded-none text-xs font-black uppercase tracking-wider transition-all border ${profile === p.id ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-transparent text-neutral-500 border-neutral-900 hover:border-neutral-800 hover:text-neutral-300'}`}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
