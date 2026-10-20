import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { APP_ICONS } from './AppIcons'
import { APP_META, DOCK_ORDER } from '../data/apps'
import type { AppId } from '../types'

interface LaunchpadProps {
  onOpenApp: (appId: AppId) => void
  onClose: () => void
}

export function Launchpad({ onOpenApp, onClose }: LaunchpadProps) {
  const [query, setQuery] = useState('')
  const apps = useMemo(
    () =>
      DOCK_ORDER.filter(
        (id) => id !== 'downloads' && id !== 'trash' && id !== 'launchpad',
      ).filter((id) => APP_META[id].name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <motion.div
      data-launchpad
      initial={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.9 }}
      className="fixed inset-0 z-[9400] flex flex-col select-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 40%, rgba(32,40,60,0.28), rgba(8,10,18,0.55)), rgba(10,12,18,0.25)',
        backdropFilter: 'blur(34px) saturate(140%)',
        WebkitBackdropFilter: 'blur(34px) saturate(140%)',
      }}
      onClick={onClose}
    >
      <div className="flex justify-center pt-[42px]" onClick={(e) => e.stopPropagation()}>
        <label className="flex h-[30px] w-[230px] items-center gap-[6px] rounded-full border border-white/25 bg-white/15 px-[10px] text-white shadow-lg backdrop-blur-xl focus-within:bg-white/20">
          <Search className="h-[12px] w-[12px] text-white/60" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[12px] text-white outline-none placeholder:text-white/45"
          />
        </label>
      </div>

      <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto px-[30px] pb-[90px] pt-[34px]">
        <div className="grid w-full max-w-[900px] grid-cols-4 gap-y-[22px] sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7" onClick={(e) => e.stopPropagation()}>
          {apps.map((id, i) => {
            const Glyph = APP_ICONS[id]
            return (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 14, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.02 + i * 0.014, duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                onClick={() => {
                  onClose()
                  onOpenApp(id)
                }}
                className="group flex flex-col items-center gap-[7px] outline-none"
              >
                <span className="transition-transform duration-150 group-hover:scale-[1.08] group-active:scale-95">
                  <Glyph className="h-[62px] w-[62px] drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] sm:h-[70px] sm:w-[70px]" />
                </span>
                <span className="max-w-[86px] truncate text-center text-[11px] font-medium text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                  {APP_META[id].name}
                </span>
              </motion.button>
            )
          })}
          {apps.length === 0 && (
            <p className="col-span-full pt-[30px] text-center text-[12px] text-white/50">No apps found</p>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[22px] flex justify-center">
        <div className="flex gap-[6px]">
          {[0, 1].map((i) => (
            <span key={i} className={`h-[6px] w-[6px] rounded-full ${i === 0 ? 'bg-white/80' : 'bg-white/25'}`} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
