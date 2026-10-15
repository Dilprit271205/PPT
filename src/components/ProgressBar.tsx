import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentChapter: number;
  totalChapters: number;
}

export function ProgressBar({ currentChapter, totalChapters }: ProgressBarProps) {
  const progress = ((currentChapter + 1) / totalChapters) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-[80] h-[2px] bg-[#101522]">
      <motion.div
        className="h-full bg-gradient-to-r from-[#E53935] to-[#FF4D5A]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />
      {/* Glow effect */}
      <motion.div
        className="absolute top-0 h-[3px] bg-[#E53935] blur-sm opacity-60"
        animate={{ width: `${progress}%` }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />
    </div>
  );
}

