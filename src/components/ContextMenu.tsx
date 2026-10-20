import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight, FolderPlus, Image, Info, SlidersHorizontal, SortAsc } from 'lucide-react'

export type SortKey = 'name' | 'kind' | 'date' | 'size'

interface ContextMenuProps {
  x: number
  y: number
  sortBy: SortKey
  onClose: () => void
  onNewFolder: () => void
  onChangeWallpaper: () => void
  onSort: (key: SortKey) => void
  onDesktopSettings: () => void
  onGetInfo: () => void
  viewport: { w: number; h: number }
}

export function ContextMenu({
  x,
  y,
  sortBy,
  onClose,
  onNewFolder,
  onChangeWallpaper,
  onSort,
  onDesktopSettings,
  onGetInfo,
  viewport,
}: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [submenu, setSubmenu] = useState(false)
  const [pos, setPos] = useState({ x, y })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setPos({
      x: Math.max(8, Math.min(x, viewport.w - el.offsetWidth - 8)),
      y: Math.max(8, Math.min(y, viewport.h - el.offsetHeight - 8)),
    })
  }, [x, y, viewport])

  const submenuLeft = pos.x + 232 + 3 + 176 > viewport.w

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const run = (fn: () => void) => {
    fn()
    onClose()
  }

  return (
    <motion.div
      ref={ref}
      data-context-menu
      initial={{ opacity: 0, scale: 0.94, y: -3 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.13, ease: [0.32, 0.72, 0, 1] }}
      className="fixed z-[9600] w-[232px] select-none rounded-[8px] border border-white/50 p-[4px] text-[#1d1d1f]"
      style={{
        left: pos.x,
        top: pos.y,
        transformOrigin: 'top left',
        background: 'rgba(246, 246, 248, 0.82)',
        backdropFilter: 'blur(48px) saturate(190%)',
        WebkitBackdropFilter: 'blur(48px) saturate(190%)',
        boxShadow:
          '0 0 0 0.5px rgba(0,0,0,0.18), 0 10px 32px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.12)',
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <MenuItem
        onClick={() => run(onNewFolder)}
        icon={<FolderPlus className="h-[13px] w-[13px]" strokeWidth={1.9} />}
      >
        New Folder
      </MenuItem>
      <MenuItem
        onClick={() => run(onGetInfo)}
        icon={<Info className="h-[13px] w-[13px]" strokeWidth={1.9} />}
      >
        Get Info
      </MenuItem>
      <div className="mx-[9px] my-[4px] h-px bg-black/[0.12]" />
      <MenuItem
        onClick={() => run(onChangeWallpaper)}
        icon={<Image className="h-[13px] w-[13px]" strokeWidth={1.9} />}
      >
        Change Wallpaper…
      </MenuItem>
      <div
        className="relative"
        onPointerEnter={() => setSubmenu(true)}
        onPointerLeave={() => setSubmenu(false)}
      >
        <MenuItem
          icon={<SortAsc className="h-[13px] w-[13px]" strokeWidth={1.9} />}
          trailing={<ChevronRight className="h-[12px] w-[12px] opacity-50" />}
          active={submenu}
        >
          Sort By
        </MenuItem>
        <AnimatePresence>
          {submenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, x: -3 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.12, ease: [0.32, 0.72, 0, 1] }}
              className={`absolute top-[-4px] w-[176px] rounded-[8px] border border-white/50 p-[4px] ${
                submenuLeft ? 'right-[calc(100%+3px)]' : 'left-[calc(100%+3px)]'
              }`}
              style={{
                transformOrigin: submenuLeft ? 'top right' : 'top left',
                background: 'rgba(246, 246, 248, 0.85)',
                backdropFilter: 'blur(48px) saturate(190%)',
                WebkitBackdropFilter: 'blur(48px) saturate(190%)',
                boxShadow: '0 0 0 0.5px rgba(0,0,0,0.18), 0 10px 30px rgba(0,0,0,0.26)',
              }}
            >
              {[
                { key: 'name' as SortKey, label: 'Name' },
                { key: 'kind' as SortKey, label: 'Kind' },
                { key: 'date' as SortKey, label: 'Date Added' },
                { key: 'size' as SortKey, label: 'Size' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => run(() => onSort(item.key))}
                  className="flex h-[22px] w-full items-center rounded-[4px] px-[8px] text-left text-[13px] hover:bg-[#0a84ff] hover:text-white"
                >
                  <span className="w-[16px]">
                    {sortBy === item.key && <Check className="h-[11px] w-[11px]" strokeWidth={3} />}
                  </span>
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mx-[9px] my-[4px] h-px bg-black/[0.12]" />
      <MenuItem
        onClick={() => run(onDesktopSettings)}
        icon={<SlidersHorizontal className="h-[13px] w-[13px]" strokeWidth={1.9} />}
      >
        Show Desktop Settings…
      </MenuItem>
    </motion.div>
  )
}

function MenuItem({
  children,
  icon,
  onClick,
  trailing,
  active,
}: {
  children: ReactNode
  icon?: ReactNode
  onClick?: () => void
  trailing?: ReactNode
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[23px] w-full items-center gap-[7px] rounded-[4px] px-[7px] text-left text-[13px] tracking-[-0.08px] ${
        active ? 'bg-[#0a84ff] text-white' : 'hover:bg-[#0a84ff] hover:text-white'
      }`}
    >
      <span className="w-[15px] shrink-0 opacity-75">{icon}</span>
      <span className="flex-1 truncate">{children}</span>
      {trailing}
    </button>
  )
}
