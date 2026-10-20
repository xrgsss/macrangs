import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { WindowInstance } from '../types'
import { APP_META } from '../data/apps'
import { APP_ICONS } from './AppIcons'
import { PhotoArt } from './Artwork'

interface MissionControlProps {
  windows: WindowInstance[]
  rects: Record<string, { x: number; y: number; width: number; height: number }>
  viewport: { w: number; h: number }
  onSelect: (id: string) => void
  onClose: () => void
}

export function MissionControl({ windows, rects, viewport, onSelect, onClose }: MissionControlProps) {
  const list = windows.filter((w) => !w.minimized)
  const layout = useMemo(() => {
    const n = Math.max(1, list.length)
    const cols = Math.ceil(Math.sqrt(n))
    const rows = Math.ceil(n / cols)
    const gap = 26
    const availableW = viewport.w - 100
    const availableH = viewport.h - 200
    const slotW = Math.min(360, Math.max(170, (availableW - gap * (cols - 1)) / cols))
    const slotH = Math.min(240, Math.max(118, (availableH - gap * (rows - 1)) / rows))
    const totalW = cols * slotW + gap * (cols - 1)
    const totalH = rows * slotH + gap * (rows - 1)
    const startX = (viewport.w - totalW) / 2
    const startY = 76 + Math.max(0, (availableH - totalH) / 2)
    return { cols, rows, gap, slotW, slotH, startX, startY }
  }, [list.length, viewport])

  return (
    <motion.div
      data-mission
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-[9500] select-none overflow-hidden"
      style={{
        background: 'rgba(9, 12, 22, 0.42)',
        backdropFilter: 'blur(26px) saturate(130%)',
        WebkitBackdropFilter: 'blur(26px) saturate(130%)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
        className="pointer-events-none absolute inset-x-0 top-[34px] flex justify-center"
      >
        <span className="rounded-full border border-white/15 bg-black/25 px-[13px] py-[4px] text-[11px] font-medium text-white/75 backdrop-blur-md">
          Mission Control
          <span className="ml-[8px] text-white/35">Esc to exit</span>
        </span>
      </motion.div>

      {list.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-white/50">
          <span className="text-[13px]">No open windows</span>
          <span className="text-[11px] text-white/30">Open an app from the Dock to get started</span>
        </div>
      ) : (
        <div
          className="absolute"
          style={{ left: layout.startX, top: layout.startY, width: layout.cols * layout.slotW + (layout.cols - 1) * layout.gap }}
          onClick={(e) => e.stopPropagation()}
        >
          {list.map((win, i) => {
            const col = i % layout.cols
            const row = Math.floor(i / layout.cols)
            const left = col * (layout.slotW + layout.gap)
            const top = row * (layout.slotH + layout.gap)
            const rect = rects[win.id]
            const scale = rect ? Math.min(1.6, Math.max(0.18, rect.width / layout.slotW)) : 0.7
            const dx = rect ? rect.x + rect.width / 2 - (layout.startX + left + layout.slotW / 2) : 0
            const dy = rect ? rect.y + rect.height / 2 - (layout.startY + top + layout.slotH / 2) : 18
            const meta = APP_META[win.appId]
            return (
              <motion.div
                key={win.id}
                className="group absolute"
                style={{ left, top, width: layout.slotW }}
                initial={{ opacity: 0, x: dx, y: dy, scale }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
              >
                <motion.button
                  aria-label={`${meta.name} — ${win.title}`}
                  onClick={() => onSelect(win.id)}
                  className="block w-full overflow-hidden rounded-[8px] border border-white/25 bg-[#1b1b1f] text-left shadow-[0_12px_34px_rgba(0,0,0,0.42)] outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  whileHover={{ scale: 1.035, y: -3 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  style={{ height: layout.slotH }}
                >
                  <div className="flex h-[18px] items-center gap-[4px] border-b border-black/20 bg-[#e8e8ec] px-[6px]">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#ff5f57]" />
                    <span className="h-[5px] w-[5px] rounded-full bg-[#febc2e]" />
                    <span className="h-[5px] w-[5px] rounded-full bg-[#28c840]" />
                    <span className="ml-[4px] truncate text-[7px] font-medium text-black/45">{win.title}</span>
                  </div>
                  <div className="relative" style={{ height: layout.slotH - 18 }}>
                    <PreviewSurface appId={win.appId} />
                  </div>
                </motion.button>
                <div className="pointer-events-none mt-[7px] flex justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <span className="max-w-full truncate rounded-[5px] border border-white/15 bg-black/45 px-[8px] py-[2px] text-[10px] font-medium text-white/85 backdrop-blur-md">
                    {meta.name}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

function PreviewSurface({ appId }: { appId: string }) {
  const Glyph = APP_ICONS[appId]

  if (appId === 'photos') {
    return (
      <div className="flex h-full bg-white">
        <div className="hidden w-[18%] flex-col gap-[3px] bg-[#f1f2f4] p-[5px] sm:flex">
          <div className="mb-[3px] h-[3px] w-[60%] rounded bg-black/20" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-[4px] rounded ${i === 0 ? 'bg-[#0a84ff]/60' : 'bg-black/10'}`} />
          ))}
        </div>
        <div className="flex-1 p-[5px]">
          <div className="mb-[4px] flex items-center justify-between">
            <div className="h-[4px] w-[24%] rounded bg-black/25" />
            <div className="h-[7px] w-[22%] rounded bg-black/10" />
          </div>
          <div className="grid grid-cols-5 gap-[2px]">
            {Array.from({ length: 20 }).map((_, i) => (
              <PhotoArt key={i} variant={i} className="aspect-square w-full rounded-[1px]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (appId === 'finder') {
    return (
      <div className="flex h-full bg-white">
        <div className="w-[20%] shrink-0 bg-[#eef0f3] p-[5px]">
          <div className="mb-[4px] h-[3px] w-[55%] rounded bg-black/20" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`mb-[3px] h-[4px] rounded ${i === 2 ? 'bg-[#0a84ff]/60' : 'bg-black/10'}`} />
          ))}
        </div>
        <div className="flex-1 p-[6px]">
          <div className="mb-[5px] flex items-center gap-[3px]">
            <div className="h-[4px] w-[18%] rounded bg-black/20" />
            <div className="ml-auto h-[6px] w-[20%] rounded bg-black/10" />
          </div>
          <div className="grid grid-cols-5 gap-[5px]">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-[2px]">
                <div className="h-[12px] w-[16px] rounded-[2px] bg-gradient-to-b from-[#8ed2ff] to-[#3a9bf2]" />
                <div className="h-[2px] w-[80%] rounded bg-black/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (appId === 'safari') {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex h-[12px] items-center gap-[3px] border-b border-black/10 bg-[#f2f2f4] px-[5px]">
          <div className="h-[4px] w-[30%] rounded-full bg-black/10" />
        </div>
        <div className="flex-1 bg-gradient-to-br from-[#f5f5f7] to-[#e4e4e9] p-[6px]">
          <div className="mx-auto mt-[3px] h-[5px] w-[40%] rounded bg-black/25" />
          <div className="mx-auto mt-[3px] h-[3px] w-[25%] rounded bg-black/15" />
          <div className="mt-[7px] grid grid-cols-4 gap-[4px]">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-[2px]">
                <div className="h-[12px] w-[12px] rounded-[3px] bg-gradient-to-br from-[#5fb8f5] to-[#2b6cb0]" />
                <div className="h-[2px] w-[70%] rounded bg-black/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (appId === 'calendar') {
    return (
      <div className="flex h-full bg-white">
        <div className="w-[20%] bg-[#f2f3f5] p-[5px]">
          <div className="mb-[4px] h-[3px] w-[60%] rounded bg-black/20" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-[3px] flex items-center gap-[2px]">
              <div className="h-[3px] w-[3px] rounded-full bg-[#0a84ff]" />
              <div className="h-[3px] flex-1 rounded bg-black/10" />
            </div>
          ))}
        </div>
        <div className="flex-1 p-[5px]">
          <div className="mb-[4px] h-[4px] w-[30%] rounded bg-black/25" />
          <div className="grid grid-cols-7 gap-[2px]">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className={`aspect-square rounded-[1px] ${i % 9 === 4 ? 'bg-[#0a84ff]/20' : 'bg-black/[0.035]'}`} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (appId === 'music') {
    return (
      <div className="flex h-full items-center justify-center gap-[10px] bg-gradient-to-br from-[#2a0f18] to-[#100a0d] p-[10px]">
        <PhotoArt variant={3} className="h-[55%] rounded-[5px]" />
        <div className="flex-1">
          <div className="h-[5px] w-[60%] rounded bg-white/60" />
          <div className="mt-[4px] h-[3px] w-[35%] rounded bg-white/25" />
          <div className="mt-[8px] h-[2px] w-full rounded bg-white/15">
            <div className="h-full w-[42%] rounded bg-[#fa2d48]" />
          </div>
        </div>
      </div>
    )
  }

  if (appId === 'notes' || appId === 'reminders' || appId === 'mail' || appId === 'messages') {
    return (
      <div className="flex h-full bg-white">
        <div className="w-[26%] bg-[#f4f4f2] p-[5px]">
          <div className="mb-[4px] h-[3px] w-[65%] rounded bg-black/25" />
          <div className="mb-[3px] h-[8px] w-full rounded bg-[#ffe9a3]" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-[3px] h-[5px] w-full rounded bg-black/[0.06]" />
          ))}
        </div>
        <div className="flex-1 p-[8px]">
          <div className="h-[4px] w-[40%] rounded bg-black/25" />
          <div className="mt-[5px] space-y-[3px]">
            <div className="h-[2px] w-full rounded bg-black/10" />
            <div className="h-[2px] w-[92%] rounded bg-black/10" />
            <div className="h-[2px] w-[78%] rounded bg-black/10" />
            <div className="h-[2px] w-[88%] rounded bg-black/10" />
            <div className="h-[2px] w-[60%] rounded bg-black/10" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-[6px] bg-[#f4f4f7]">
      <Glyph className="h-[34px] w-[34px] drop-shadow-sm" />
      <div className="h-[4px] w-[28%] rounded bg-black/20" />
      <div className="h-[3px] w-[40%] rounded bg-black/10" />
    </div>
  )
}
