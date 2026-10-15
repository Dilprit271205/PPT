import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface NavigationProps {
  currentChapter: number;
  totalChapters: number;
  onPrev: () => void;
  onNext: () => void;
  onMenuToggle: () => void;
  onHome: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
}

export function Navigation({
  currentChapter,
  totalChapters,
  onPrev,
  onNext,
  onMenuToggle,
  onHome,
  onFullscreen,
  isFullscreen,
}: NavigationProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: 'linear-gradient(to bottom, rgba(7,8,12,0.95) 0%, rgba(7,8,12,0.7) 70%, transparent 100%)',
      }}
    >
      {/* Left: Logo + Home */}
      <div className="flex items-center gap-4">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-[#F8FAFC] hover:text-[#E53935] transition-colors group"
          aria-label="Go to start"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E53935]/10 border border-[#E53935]/30 flex items-center justify-center group-hover:bg-[#E53935]/20 transition-colors">
            <Home size={16} className="text-[#E53935]" />
          </div>
          <span className="text-sm font-semibold tracking-wider font-['Space_Grotesk'] hidden sm:inline">
            ATTACKTWIN
          </span>
        </button>
      </div>

      {/* Center: Chapter indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          disabled={currentChapter === 0}
          className="w-8 h-8 rounded-full border border-[#94A3B8]/20 flex items-center justify-center 
                     text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E53935]/50 
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous chapter"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={onMenuToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#94A3B8]/20 
                     hover:border-[#E53935]/50 transition-all group"
          aria-label="Open chapter menu"
        >
          <Menu size={14} className="text-[#94A3B8] group-hover:text-[#E53935] transition-colors" />
          <span className="text-xs text-[#94A3B8] group-hover:text-[#F8FAFC] font-mono transition-colors">
            {String(currentChapter + 1).padStart(2, '0')} / {String(totalChapters).padStart(2, '0')}
          </span>
        </button>

        <button
          onClick={onNext}
          disabled={currentChapter === totalChapters - 1}
          className="w-8 h-8 rounded-full border border-[#94A3B8]/20 flex items-center justify-center 
                     text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E53935]/50 
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next chapter"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Right: Fullscreen */}
      <div className="flex items-center gap-3">
        <button
          onClick={onFullscreen}
          className="w-8 h-8 rounded-lg border border-[#94A3B8]/20 flex items-center justify-center 
                     text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E53935]/50 transition-all"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </motion.nav>
  );
}

