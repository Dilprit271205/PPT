import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#07080C] flex flex-col items-center justify-center">
      {/* Animated logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative"
      >
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-[#E53935]/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 80, height: 80, margin: '-16px' }}
        />

        {/* Core dot */}
        <motion.div
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E53935] to-[#FF4D5A] shadow-lg shadow-[#E53935]/30"
          animate={{
            boxShadow: [
              '0 0 20px rgba(229,57,53,0.3)',
              '0 0 40px rgba(229,57,53,0.5)',
              '0 0 20px rgba(229,57,53,0.3)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 text-center"
      >
        <h1 className="text-lg font-semibold text-[#F8FAFC] font-['Space_Grotesk'] tracking-[0.3em]">
          ATTACKTWIN AI
        </h1>
        <p className="text-xs text-[#94A3B8] mt-2 font-mono tracking-wider">
          INITIALIZING SECURITY DIGITAL TWIN
        </p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 w-48 h-[2px] bg-[#101522] rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[#E53935] to-[#FF4D5A]"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '50%' }}
        />
      </motion.div>
    </div>
  );
}

