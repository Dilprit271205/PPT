import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  SkipForward
} from 'lucide-react';

interface NavigationProps {
  currentChapter: number;
  totalChapters: number;
  onPrev: () => void;
  onNext: () => void;
  onMenuToggle: () => void;
  onHome: () => void;
  onEnd: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  isAutoplay: boolean;
  onToggleAutoplay: () => void;
  onReset: () => void;
}

export function Navigation({
  currentChapter,
  totalChapters,
  onPrev,
  onNext,
  onMenuToggle,
  onHome,
  onEnd,
  onFullscreen,
  isFullscreen,
  isAutoplay,
  onToggleAutoplay,
  onReset,
}: NavigationProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3.5"
      style={{
        background: 'linear-gradient(to bottom, rgba(7,8,12,0.95) 0%, rgba(7,8,12,0.7) 70%, transparent 100%)',
      }}
    >
      {/* Left: Brand + Quick Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-[#F8FAFC] hover:text-[#E53935] transition-colors group"
          title="Return to Chapter 1 (Opening)"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E53935]/10 border border-[#E53935]/30 flex items-center justify-center group-hover:bg-[#E53935]/20 transition-colors">
            <Home size={15} className="text-[#E53935]" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wider font-['Space_Grotesk'] hidden md:inline">
            ATTACKTWIN <span className="text-[#E53935]">AI</span>
          </span>
        </button>

        <button
          onClick={onReset}
          className="w-8 h-8 rounded-lg border border-[#94A3B8]/20 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E53935]/40 transition-all hidden sm:flex"
          title="Reset presentation & scenario state"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Center: Chapter Stepper & Autoplay */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onPrev}
          disabled={currentChapter === 0}
          className="w-8 h-8 rounded-full border border-[#94A3B8]/20 flex items-center justify-center 
                     text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E53935]/50 
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Previous Chapter (← key)"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={onMenuToggle}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-[#94A3B8]/20 
                     hover:border-[#E53935]/50 transition-all group bg-[#101522]/50 backdrop-blur-sm"
          title="Open Chapter Table of Contents"
        >
          <Menu size={13} className="text-[#94A3B8] group-hover:text-[#E53935] transition-colors" />
          <span className="text-xs text-[#94A3B8] group-hover:text-[#F8FAFC] font-mono transition-colors font-semibold">
            {String(currentChapter + 1).padStart(2, '0')} / {String(totalChapters).padStart(2, '0')}
          </span>
        </button>

        <button
          onClick={onNext}
          disabled={currentChapter === totalChapters - 1}
          className="w-8 h-8 rounded-full border border-[#94A3B8]/20 flex items-center justify-center 
                     text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E53935]/50 
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Next Chapter (→ key)"
        >
          <ChevronRight size={16} />
        </button>

        <div className="h-4 w-px bg-[#94A3B8]/20 mx-1 hidden sm:block" />

        {/* Autoplay Toggle */}
        <button
          onClick={onToggleAutoplay}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-mono text-[11px] transition-all hidden sm:flex ${
            isAutoplay
              ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]'
              : 'border-[#94A3B8]/20 text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
          title={isAutoplay ? 'Pause auto-presentation' : 'Start auto-presentation (auto-scroll)'}
        >
          {isAutoplay ? <Pause size={12} /> : <Play size={12} />}
          <span className="hidden lg:inline">{isAutoplay ? 'AUTOPLAY ON' : 'AUTOPLAY'}</span>
        </button>
      </div>

      {/* Right: End Jump + Fullscreen */}
      <div className="flex items-center gap-2">
        <button
          onClick={onEnd}
          className="w-8 h-8 rounded-lg border border-[#94A3B8]/20 flex items-center justify-center 
                     text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E53935]/50 transition-all hidden sm:flex"
          title="Jump to Final Demonstration (End key)"
        >
          <SkipForward size={14} />
        </button>

        <button
          onClick={onFullscreen}
          className="w-8 h-8 rounded-lg border border-[#94A3B8]/20 flex items-center justify-center 
                     text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E53935]/50 transition-all"
          title={isFullscreen ? 'Exit Fullscreen (F key)' : 'Enter Fullscreen (F key)'}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </motion.nav>
  );
}
