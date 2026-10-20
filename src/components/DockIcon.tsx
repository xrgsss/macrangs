import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimation, useSpring, useTransform } from 'framer-motion'
import { APP_ICONS } from './AppIcons'
import type { AppId } from '../types'
import { APP_META } from '../data/apps'

interface DockIconProps {
  appId: AppId
  size: number
  scale: number
  running: boolean
  active: boolean
  onOpen: (appId: AppId, rect: DOMRect) => void
  tooltipVisible: boolean
}

export const DockIcon = memo(function DockIcon({
  appId,
  size,
  scale,
  running,
  active,
  onOpen,
  tooltipVisible,
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const spring = useSpring(1, { stiffness: 460, damping: 34, mass: 0.72 })
  const width = useTransform(spring, (v) => Math.max(1, size * v))
  const height = useTransform(spring, (v) => Math.max(1, size * v))
  const Glyph = APP_ICONS[appId] ?? APP_ICONS.finder
  const meta = APP_META[appId]
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    spring.set(scale)
  }, [scale, spring])

  const bounce = () => {
    controls.start({
      y: [0, -Math.round(size * 0.22), 0, -Math.round(size * 0.09), 0],
      transition: { duration: 0.62, times: [0, 0.26, 0.55, 0.76, 1], ease: 'easeOut' },
    })
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!running) bounce()
    const rect = ref.current?.getBoundingClientRect()
    if (rect) onOpen(appId, rect)
  }

  return (
    <motion.div
      ref={ref}
      data-dock-icon={appId}
      className="relative shrink-0"
      style={{ width, height }}
    >
      <motion.button
        type="button"
        aria-label={meta.name}
        onClick={handleClick}
        animate={controls}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        className="mac-dock-icon absolute inset-0 origin-bottom outline-none"
        style={{ transformOrigin: 'bottom center' }}
      >
        <motion.span
          className="block h-full w-full"
          animate={{ scale: pressed ? 0.92 : 1 }}
          transition={{ type: 'spring', stiffness: 600, damping: 28 }}
        >
          <Glyph className="h-full w-full drop-shadow-[0_3px_4px_rgba(0,0,0,0.28)]" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {tooltipVisible && (
          <motion.div
            data-dock-tooltip={appId}
            initial={{ opacity: 0, y: 5, scale: 0.96, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 3, scale: 0.98, x: '-50%' }}
            transition={{ duration: 0.16, ease: [0.32, 0.72, 0, 1] }}
            className="pointer-events-none absolute left-1/2 z-[60] whitespace-nowrap rounded-[6px] border border-white/70 px-[8px] py-[3px] text-[11.5px] font-medium text-[#1d1d1f]"
            style={{
              bottom: 'calc(100% + 11px)',
              background: 'rgba(248,248,250,0.86)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 3px 12px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.08)',
            }}
          >
            {meta.name}
          </motion.div>
        )}
      </AnimatePresence>

      {running && (
        <span
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            bottom: -5,
            width: 4,
            height: 4,
            background: '#1c1c1e',
            opacity: active ? 0.85 : 0.5,
            boxShadow: '0 0 0 0.5px rgba(255,255,255,0.25)',
          }}
        />
      )}
    </motion.div>
  )
})
