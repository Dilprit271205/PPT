import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CHAPTERS } from '../data/scenarioData';

interface ChapterMenuProps {
  isOpen: boolean;
  currentChapter: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function ChapterMenu({ isOpen, currentChapter, onSelect, onClose }: ChapterMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#07080C]/90 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-[#101522]/95 
                       backdrop-blur-xl border-l border-[#94A3B8]/10 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#94A3B8]/10">
              <h2 className="text-lg font-semibold text-[#F8FAFC] font-['Space_Grotesk'] tracking-wide">
                CHAPTERS
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-[#94A3B8]/20 flex items-center justify-center 
                           text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#E53935]/50 transition-all"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chapter List */}
            <div className="p-4 space-y-1">
              {CHAPTERS.map((chapter, index) => (
                <motion.button
                  key={chapter.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => onSelect(index)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all group flex items-start gap-4 ${
                    currentChapter === index
                      ? 'bg-[#E53935]/10 border border-[#E53935]/30'
                      : 'hover:bg-[#F8FAFC]/5 border border-transparent'
                  }`}
                >
                  <span
                    className={`text-xs font-mono mt-1 shrink-0 w-6 ${
                      currentChapter === index ? 'text-[#E53935]' : 'text-[#94A3B8]/60'
                    }`}
                  >
                    {String(chapter.number).padStart(2, '0')}
                  </span>
                  <div>
                    <div
                      className={`text-sm font-medium font-['Space_Grotesk'] tracking-wide ${
                        currentChapter === index ? 'text-[#F8FAFC]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
                      } transition-colors`}
                    >
                      {chapter.title}
                    </div>
                    <div className="text-xs text-[#94A3B8]/60 mt-0.5">{chapter.subtitle}</div>
                  </div>
                  {currentChapter === index && (
                    <div className="ml-auto mt-2 w-1.5 h-1.5 rounded-full bg-[#E53935] shrink-0" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-6 py-4 border-t border-[#94A3B8]/10 mt-4">
              <p className="text-xs text-[#94A3B8]/50 font-mono">
                Use ← → arrow keys to navigate • Press F for fullscreen
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

