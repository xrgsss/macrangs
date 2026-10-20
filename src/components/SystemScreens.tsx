import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import { Wallpaper } from './Wallpaper'
import { useClock } from '../hooks/useClock'

export function SleepScreen({ onWake }: { onWake: () => void }) {
  return (
    <motion.div
      data-modal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      onClick={onWake}
      onPointerDown={onWake}
      className="fixed inset-0 z-[9900] flex cursor-pointer flex-col items-center justify-center bg-black"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.45, 0] }}
        transition={{ delay: 0.9, duration: 2.4, repeat: Infinity, repeatDelay: 1.6 }}
        className="text-[11px] font-medium tracking-[0.02em] text-white/40"
      >
        Click anywhere to wake
      </motion.span>
    </motion.div>
  )
}

export function LockScreen({ wallpaper, onUnlock }: { wallpaper: string; onUnlock: () => void }) {
  const now = useClock()
  const [password, setPassword] = useState('')

  const unlock = () => onUnlock()

  return (
    <motion.div
      data-modal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-[9910] flex select-none flex-col items-center overflow-hidden"
    >
      <div className="absolute inset-0 scale-[1.04] blur-[7px]">
        <Wallpaper variant={wallpaper} className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-black/[0.28]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
        className="relative mt-[7vh] text-center text-white"
      >
        <p className="text-[13px] font-medium tracking-[0.01em] text-white/75">
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <p className="mt-[1px] text-[64px] font-light leading-none tracking-[-2.6px] text-white/95 drop-shadow-[0_4px_20px_rgba(0,0,0,0.28)] sm:text-[76px]">
          {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.12, type: 'spring', stiffness: 300, damping: 30 }}
        className="relative mt-auto mb-[11vh] flex w-[min(320px,calc(100vw-48px))] flex-col items-center"
      >
        <div className="relative">
          <div className="grid h-[82px] w-[82px] place-items-center rounded-full bg-gradient-to-br from-[#ffb06b] via-[#ff6b7a] to-[#a05aff] text-[30px] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]">
            R
          </div>
          <span className="absolute -bottom-[2px] -right-[2px] grid h-[25px] w-[25px] place-items-center rounded-full border border-white/50 bg-white/80 text-[#2b2b2e] shadow-md backdrop-blur">
            <Lock className="h-[12px] w-[12px]" strokeWidth={2.3} />
          </span>
        </div>
        <p className="mt-[11px] text-[14px] font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
          Rangshar
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            unlock()
          }}
          className="mt-[12px] flex w-full items-center gap-[6px]"
        >
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="h-[30px] min-w-0 flex-1 rounded-full border border-white/35 bg-white/20 px-[12px] text-[12px] text-white outline-none backdrop-blur-xl placeholder:text-white/45 focus:border-white/60 focus:bg-white/25"
          />
          <button
            type="submit"
            aria-label="Unlock"
            className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border border-white/35 bg-white/20 text-white backdrop-blur-xl transition-colors hover:bg-white/30"
          >
            <ArrowRight className="h-[14px] w-[14px]" strokeWidth={2.4} />
          </button>
        </form>
        <button
          onClick={unlock}
          className="mt-[10px] text-[10.5px] font-medium text-white/60 transition-colors hover:text-white/85"
        >
          Touch ID or click to unlock
        </button>
        <div className="mt-[22px] flex items-center gap-[6px] text-[9.5px] text-white/35">
          <span className="h-[3px] w-[3px] rounded-full bg-white/40" />
          macOS Big Sur
          <span className="h-[3px] w-[3px] rounded-full bg-white/40" />
        </div>
      </motion.div>
    </motion.div>
  )
}
