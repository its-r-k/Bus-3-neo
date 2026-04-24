/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bluetooth, 
  BluetoothOff, 
  Battery, 
  Volume2, 
  Wind, 
  Mic2, 
  Sliders, 
  Settings as SettingsIcon, 
  Zap, 
  ShieldCheck,
  Disc,
  Info,
  ChevronRight,
  Maximize2,
  Headphones,
  X,
  BellRing,
  Radar,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type AncMode = 'noise-cancellation' | 'normal' | 'transparency';
type EqPreset = 'bass-boost' | 'balanced' | 'bright';

interface BatteryState {
  left: number;
  right: number;
  case: number;
}

// --- Components ---

const BatteryIndicator = ({ label, value, icon: Icon }: { label: string, value: number, icon: any }) => (
  <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/10 flex-1">
    <div className="flex items-center justify-between w-full px-1">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{label}</span>
      <Icon className="w-3 h-3 text-zinc-400" />
    </div>
    <div className="relative w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`absolute inset-0 rounded-full ${value < 20 ? 'bg-red-500' : 'bg-emerald-500'}`}
      />
    </div>
    <span className="text-sm font-mono font-medium text-white">{value}%</span>
  </div>
);

const AncButton = ({ mode, currentMode, onClick, label, icon: Icon, activeColor = '#00FFD1' }: { 
  mode: AncMode, 
  currentMode: AncMode, 
  onClick: (mode: AncMode) => void, 
  label: string, 
  icon: any,
  activeColor?: string
}) => {
  const isActive = currentMode === mode;
  return (
    <button 
      onClick={() => onClick(mode)}
      className={`flex flex-col items-center justify-center gap-3 p-4 rounded-3xl transition-all duration-300 flex-1 border ${
        isActive 
          ? `bg-[${activeColor}] border-[${activeColor}] text-black shadow-[0_0_20px_rgba(0,255,209,0.3)]` 
          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
      }`}
      style={isActive ? { backgroundColor: activeColor, borderColor: activeColor } : {}}
    >
      <Icon className={`w-6 h-6 ${isActive ? 'text-black' : 'text-slate-300'}`} />
      <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span>
    </button>
  );
};

const FeatureToggle = ({ label, sublabel, icon: Icon, active, onClick }: { label: string, sublabel?: string, icon: any, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 w-full group hover:bg-white/10 transition-colors"
  >
    <div className="flex items-center gap-4 text-left">
      <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-[#00FFD1]/20 text-[#00FFD1]' : 'bg-slate-800 text-slate-500'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {sublabel && <p className="text-[10px] text-slate-500 uppercase tracking-tight">{sublabel}</p>}
      </div>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-[#00FFD1]' : 'bg-slate-700'}`}>
      <motion.div 
        animate={{ x: active ? 22 : 2 }}
        className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm"
      />
    </div>
  </button>
);

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [ancMode, setAncMode] = useState<AncMode>('normal');
  const [eqPreset, setEqPreset] = useState<EqPreset>('balanced');
  const [battery, setBattery] = useState<BatteryState>({ left: 85, right: 82, case: 100 });
  const [isGameMode, setIsGameMode] = useState(false);
  const [isForceAnc, setIsForceAnc] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'controls' | 'settings'>('home');
  const [isFindingBuds, setIsFindingBuds] = useState(false);
  const [playingSound, setPlayingSound] = useState<'none' | 'left' | 'right' | 'both'>('none');
  const [signalStrength, setSignalStrength] = useState(75);

  // Simulate connection
  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isFindingBuds) {
      const interval = setInterval(() => {
        setSignalStrength(prev => {
          const change = (Math.random() - 0.5) * 15;
          return Math.min(Math.max(prev + change, 10), 100);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFindingBuds]);

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 font-sans selection:bg-[#00FFD1]/30 relative overflow-x-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,_#0F2027_0%,_#05070A_70%)] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto min-h-screen flex flex-col relative z-10">
        
        {/* Header */}
        <header className="p-8 lg:px-12 lg:pt-10 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-white">REALME BUDS <span className="text-[#00FFD1]">NEO 3</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Connected • Firmware v2.1.4</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex px-4 py-2 bg-white/5 border border-white/10 rounded-full items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00FFD1] animate-pulse shadow-[0_0_8px_#00FFD1]' : 'bg-red-500'}`} />
              <span className="text-[10px] font-bold tracking-wide">LIVE STATUS</span>
            </div>
            <button className="p-2.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all hover:scale-110">
              {isConnected ? <Bluetooth className="w-5 h-5 text-[#00FFD1]" /> : <BluetoothOff className="w-5 h-5 text-slate-500" />}
            </button>
          </div>
        </header>

        <main className="flex-1 px-8 lg:px-12 flex flex-col">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center gap-8">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-40 h-40 rounded-full border-2 border-[#00FFD1]/20 flex items-center justify-center"
              >
                <Bluetooth className="w-16 h-16 text-[#00FFD1]" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold mb-3">Searching for Buds...</h2>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">Ensure your Realme Buds are in pairing mode to begin your immersive experience.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-8 flex-1">
              {/* Left Column: Noise Control & Gaming */}
              <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
                <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-7 rounded-[2.5rem] shadow-2xl">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Noise Control</h3>
                  <div className="space-y-4">
                    <AncButton 
                      mode="noise-cancellation" 
                      currentMode={ancMode} 
                      onClick={setAncMode} 
                      label="Noise Canc." 
                      icon={ShieldCheck} 
                    />
                    <AncButton 
                      mode="transparency" 
                      currentMode={ancMode} 
                      onClick={setAncMode} 
                      label="Transparent" 
                      icon={Wind} 
                    />
                    <AncButton 
                      mode="normal" 
                      currentMode={ancMode} 
                      onClick={setAncMode} 
                      label="Off" 
                      icon={Volume2} 
                    />
                  </div>
                </section>

                <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-7 rounded-[2.5rem]">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Enhanced Rules</h3>
                  <div className="space-y-4">
                    <FeatureToggle 
                      label="Gaming Mode" 
                      sublabel="88ms Low Latency"
                      icon={Zap} 
                      active={isGameMode} 
                      onClick={() => setIsGameMode(!isGameMode)} 
                    />
                    <FeatureToggle 
                      label="Force ANC" 
                      sublabel="Consistent Cancellation"
                      icon={Maximize2} 
                      active={isForceAnc} 
                      onClick={() => setIsForceAnc(!isForceAnc)} 
                    />
                  </div>
                </section>
              </div>

              {/* Center Column: Visuals & Battery */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center relative order-1 lg:order-2 py-12 lg:py-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#00FFD1]/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex gap-12 lg:gap-20 items-end mb-16">
                  {/* Left Bud */}
                  <div className="text-center group">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="w-24 h-36 lg:w-32 lg:h-44 bg-gradient-to-b from-slate-200 to-slate-400 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-slate-400/20 flex flex-col items-center justify-center p-1"
                    >
                       <Headphones className="w-12 h-12 text-slate-800 opacity-40" />
                       <div className="mt-4 flex flex-col">
                         <span className="text-xs font-bold text-slate-800">L</span>
                         <div className="w-8 h-1 bg-slate-800/20 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-slate-800" style={{ width: `${battery.left}%` }} />
                         </div>
                       </div>
                    </motion.div>
                    <div className="mt-6">
                      <p className="text-3xl font-bold font-mono tracking-tighter">{battery.left}%</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Left Bud</p>
                    </div>
                  </div>

                  {/* Right Bud */}
                  <div className="text-center group">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="w-24 h-36 lg:w-32 lg:h-44 bg-gradient-to-b from-slate-200 to-slate-400 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-slate-400/20 flex flex-col items-center justify-center p-1"
                    >
                       <Headphones className="w-12 h-12 text-slate-800 opacity-40 rotate-y-180" />
                       <div className="mt-4 flex flex-col">
                         <span className="text-xs font-bold text-slate-800">R</span>
                         <div className="w-8 h-1 bg-slate-800/20 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-slate-800" style={{ width: `${battery.right}%` }} />
                         </div>
                       </div>
                    </motion.div>
                    <div className="mt-6">
                      <p className="text-3xl font-bold font-mono tracking-tighter">{battery.right}%</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Right Bud</p>
                    </div>
                  </div>
                </div>

                <div className="px-10 py-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex items-center gap-8 shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest">CASE</span>
                    <span className="font-mono text-lg font-bold">{battery.case}%</span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="flex items-center gap-3 text-[#00FFD1]">
                    <span className="text-[10px] font-bold tracking-widest">STATUS</span>
                    <span className="text-sm font-semibold italic">Fully Charged</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Audio & Visualizer */}
              <div className="lg:col-span-3 space-y-8 order-3">
                <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-7 rounded-[2.5rem]">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Sound Effects</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {(['bass-boost', 'balanced', 'bright'] as EqPreset[]).map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setEqPreset(preset)}
                        className={`p-5 rounded-2xl border text-center transition-all ${
                          eqPreset === preset 
                            ? 'bg-white/10 border-[#00FFD1]/50 text-white shadow-[0_0_15px_rgba(0,255,209,0.15)] scale-105' 
                            : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-tight">{preset.replace('-', ' ')}</p>
                      </button>
                    ))}
                    <button className="p-5 rounded-2xl bg-white/5 border border-white/5 text-slate-500 text-center opacity-50 cursor-not-allowed">
                      <p className="text-[10px] font-bold uppercase tracking-tight">Custom</p>
                    </button>
                  </div>
                </section>

                <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-7 rounded-[2.5rem] flex-1 min-h-[14rem] flex flex-col">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Volume Level</h3>
                  <div className="flex-1 flex items-end justify-between gap-2.5 pb-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => {
                      const isActive = i <= 5;
                      const height = [25, 45, 75, 100, 90, 50, 35][i-1];
                      return (
                        <div 
                          key={i} 
                          className={`w-full rounded-full transition-all duration-500 ${
                            isActive ? 'bg-[#00FFD1] shadow-[0_0_12px_rgba(0,255,209,0.5)]' : 'bg-white/10'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-8 flex justify-between items-center bg-black/20 p-3 rounded-2xl border border-white/5">
                    <span className="text-2xl font-bold font-mono text-white">72<span className="text-[10px] text-slate-500 ml-1">dB</span></span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Balanced</span>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>

        {/* Global Navbar */}
        <footer className="py-10 flex justify-center gap-12 lg:gap-24 relative z-10">
          <NavButton icon={Sliders} label="Controls" />
          <NavButton icon={Disc} label="Find My Buds" onClick={() => setIsFindingBuds(true)} pulse />
          <NavButton icon={Maximize2} label="Update" />
        </footer>
      </div>

      {/* Find My Buds Overlay */}
      <AnimatePresence>
        {isFindingBuds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#05070A]/95 backdrop-blur-2xl flex flex-col pt-12 pb-8 px-8 lg:px-12"
          >
            <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
               <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                 <Radar className="text-[#00FFD1] w-8 h-8" /> Find My Buds
               </h2>
               <button onClick={() => { setIsFindingBuds(false); setPlayingSound('none'); }} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                 <X className="w-6 h-6 text-slate-400" />
               </button>
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full gap-12 lg:gap-24 relative">
               {/* Radar Visualization */}
               <div className="relative w-64 h-64 lg:w-96 lg:h-96 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#00FFD1]/5 rounded-full blur-[50px] animate-pulse" />
                  
                  {/* Concentric rings */}
                  {[1, 2, 3].map(ring => (
                    <motion.div
                      key={ring}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 2 * ring, repeat: Infinity }}
                      className="absolute rounded-full border border-[#00FFD1]/20"
                      style={{ width: `${ring * 30}%`, height: `${ring * 30}%` }}
                    />
                  ))}

                  <div className="z-10 text-center flex flex-col items-center">
                    <div className="text-5xl font-mono font-bold text-[#00FFD1] mb-2">{Math.round(signalStrength)}%</div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-slate-400 font-bold">Signal Strength</span>
                  </div>
               </div>

               {/* Controls */}
               <div className="w-full lg:w-96 space-y-6 flex flex-col min-h-max z-10 relative">
                  <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                    <p className="text-xs text-red-200/80 leading-relaxed font-medium">
                      <strong className="text-red-400">WARNING:</strong> Remove earbuds from ears before playing the sound. Playing loud sounds while wearing them may cause hearing damage.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FindBudButton label="Left Bud" side="left" playing={playingSound === 'left' || playingSound === 'both'} onClick={() => setPlayingSound(playingSound === 'left' ? 'none' : 'left')} />
                    <FindBudButton label="Right Bud" side="right" playing={playingSound === 'right' || playingSound === 'both'} onClick={() => setPlayingSound(playingSound === 'right' ? 'none' : 'right')} />
                  </div>
                  
                  <button 
                    onClick={() => setPlayingSound(playingSound === 'both' ? 'none' : 'both')}
                    className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${
                      playingSound === 'both' 
                        ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-[#00FFD1] hover:text-black hover:border-[#00FFD1]'
                    }`}
                  >
                    {playingSound === 'both' ? 'Stop Sound' : 'Play Both'}
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ icon: Icon, label, pulse = false, onClick }: { icon: any, label: string, pulse?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-4 text-slate-400 hover:text-[#00FFD1] transition-all group cursor-pointer z-10 w-auto">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#00FFD1]/10 group-hover:border-[#00FFD1]/30 transition-all ${pulse ? 'relative' : ''}`}>
        {pulse && <div className="absolute inset-0 bg-[#00FFD1]/20 rounded-2xl animate-ping" />}
        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function FindBudButton({ label, side, playing, onClick }: { label: string, side: 'left' | 'right', playing: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-4 p-6 rounded-3xl transition-all border ${
        playing 
          ? 'bg-[#00FFD1]/20 border-[#00FFD1] text-[#00FFD1] shadow-[0_0_20px_rgba(0,255,209,0.2)]' 
          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
      }`}
    >
      <BellRing className={`w-8 h-8 ${playing ? 'animate-bounce' : ''}`} />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{playing ? 'Playing...' : label}</span>
    </button>
  );
}

function NavIcon({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-emerald-400' : 'text-zinc-500'}`}
    >
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-emerald-500/10' : ''}`}>
        <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-dot"
          className="w-1 h-1 bg-emerald-400 rounded-full"
        />
      )}
    </button>
  );
}
