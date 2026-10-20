import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { WALLPAPERS, Wallpaper } from './Wallpaper'

interface WallpaperPickerProps {
  current: string
  onSelect: (id: string) => void
  onClose: () => void
}

export function WallpaperPicker({ current, onSelect, onClose }: WallpaperPickerProps) {
  return (
    <motion.div
      data-modal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.17 }}
      className="fixed inset-0 z-[9700] flex items-center justify-center bg-black/20 p-4 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 4 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.85 }}
        className="flex max-h-[82vh] w-full max-w-[660px] flex-col overflow-hidden rounded-[13px] border border-white/40 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
        style={{
          background: 'rgba(246,246,248,0.82)',
          backdropFilter: 'blur(50px) saturate(190%)',
          WebkitBackdropFilter: 'blur(50px) saturate(190%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[42px] shrink-0 items-center justify-between border-b border-black/[0.09] px-[14px]">
          <div className="flex items-center gap-[7px]">
            <span className="text-[13px] font-semibold tracking-[-0.15px] text-[#1d1d1f]">Desktop Pictures</span>
            <span className="rounded-[4px] bg-black/[0.06] px-[5px] py-[1px] text-[9.5px] text-black/40">Big Sur</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-[22px] w-[22px] place-items-center rounded-full text-black/45 hover:bg-black/[0.08]"
          >
            <X className="h-[13px] w-[13px]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-[14px]">
          <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-3">
            {WALLPAPERS.map((wp) => {
              const active = current === wp.id
              return (
                <button key={wp.id} onClick={() => onSelect(wp.id)} className="group text-left">
                  <div
                    className={`relative aspect-[16/10] overflow-hidden rounded-[6px] border-2 transition-all duration-150 ${
                      active ? 'border-[#0a84ff]' : 'border-transparent group-hover:border-black/15'
                    }`}
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.14)' }}
                  >
                    <Wallpaper variant={wp.id} className="absolute inset-0 h-full w-full" />
                    {active && (
                      <span className="absolute right-[5px] top-[5px] grid h-[17px] w-[17px] place-items-center rounded-full bg-[#0a84ff] text-white shadow">
                        <Check className="h-[10px] w-[10px]" strokeWidth={3.4} />
                      </span>
                    )}
                  </div>
                  <p className="mt-[5px] truncate text-[11px] font-medium text-[#2b2b2e]">{wp.name}</p>
                  <p className="text-[9px] text-black/35">{wp.subtitle}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex h-[46px] shrink-0 items-center justify-between border-t border-black/[0.08] px-[14px]">
          <p className="text-[9.5px] text-black/35">Changes are applied to the desktop immediately.</p>
          <button
            onClick={onClose}
            className="rounded-[6px] bg-[#0a84ff] px-[14px] py-[4px] text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
