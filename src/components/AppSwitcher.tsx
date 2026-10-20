import { motion } from 'framer-motion'
import { APP_ICONS } from './AppIcons'
import { APP_META } from '../data/apps'
import type { AppId } from '../types'

interface AppSwitcherProps {
  apps: AppId[]
  index: number
  onSelect: (appId: AppId) => void
  onClose: () => void
}

export function AppSwitcher({ apps, index, onSelect, onClose }: AppSwitcherProps) {
  return (
    <motion.div
      data-switcher
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="fixed inset-0 z-[9820] flex items-center justify-center bg-black/15 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 360, damping: 32, mass: 0.85 }}
        className="max-w-[min(760px,calc(100vw-36px))] rounded-[20px] border border-white/50 p-[14px]"
        style={{
          background: 'rgba(246,246,248,0.7)',
          backdropFilter: 'blur(44px) saturate(190%)',
          WebkitBackdropFilter: 'blur(44px) saturate(190%)',
          boxShadow: '0 22px 64px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.14), inset 0 0.5px 0 rgba(255,255,255,0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex max-w-full flex-wrap items-start justify-center gap-[10px]">
          {apps.map((appId, i) => {
            const Glyph = APP_ICONS[appId]
            const selected = i === index
            return (
              <button
                key={appId}
                onClick={() => {
                  onClose()
                  onSelect(appId)
                }}
                className={`flex w-[82px] flex-col items-center gap-[7px] rounded-[12px] px-[4px] py-[7px] transition-colors ${
                  selected ? 'bg-black/[0.08]' : 'hover:bg-black/[0.04]'
                }`}
              >
                <span className={`transition-transform duration-100 ${selected ? 'scale-[1.07]' : ''}`}>
                  <Glyph className="h-[54px] w-[54px] drop-shadow-[0_5px_12px_rgba(0,0,0,0.28)]" />
                </span>
                <span
                  className={`w-full truncate text-center text-[10.5px] font-medium ${
                    selected ? 'text-[#1d1d1f]' : 'text-black/55'
                  }`}
                >
                  {APP_META[appId].name}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
