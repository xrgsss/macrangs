import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import type { WindowInstance } from '../types'
import { APP_META } from '../data/apps'

interface AppWindowProps {
  win: WindowInstance
  active: boolean
  children: ReactNode
  onFocus: (id: string) => void
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  onToggleMaximize: (id: string) => void
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

export function AppWindow({
  win,
  active,
  children,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
}: AppWindowProps) {
  const meta = APP_META[win.appId]
  const dark = meta.chrome === 'dark'
  const [viewport, setViewport] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  }))
  const [dragging, setDragging] = useState(false)
  const [closing, setClosing] = useState(false)

  const initial = useRef(
    (() => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const compact = vw < 700
      const maxW = vw - (compact ? 12 : 48)
      const maxH = vh - 26 - (compact ? 70 : 100)
      const width = Math.max(300, Math.min(meta.width, maxW))
      const height = Math.max(240, Math.min(meta.height, maxH))
      const offset = (win.spawnIndex % 6) * 26
      const x = clamp((vw - width) / 2 + offset - 54, 6, Math.max(6, vw - width - 6))
      const y = clamp((vh - height) / 2 + offset - 72, 34, Math.max(34, vh - height - 82))
      return { x, y, w: width, h: height }
    })(),
  )

  const x = useMotionValue(initial.current.x)
  const y = useMotionValue(initial.current.y)
  const w = useMotionValue(initial.current.w)
  const h = useMotionValue(initial.current.h)

  const normalRect = useRef({ ...initial.current })
  const wasMaximized = useRef(win.maximized)

  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const vw = viewport.w
    const vh = viewport.h
    if (win.maximized) {
      const target = {
        x: 0,
        y: 26,
        w: vw,
        h: Math.max(320, vh - 26 - (vw < 700 ? 68 : 84)),
      }
      animate(x, target.x, { type: 'spring', stiffness: 330, damping: 34, mass: 0.9 })
      animate(y, target.y, { type: 'spring', stiffness: 330, damping: 34, mass: 0.9 })
      animate(w, target.w, { type: 'spring', stiffness: 330, damping: 34, mass: 0.9 })
      animate(h, target.h, { type: 'spring', stiffness: 330, damping: 34, mass: 0.9 })
      wasMaximized.current = true
    } else if (wasMaximized.current) {
      const target = normalRect.current
      const nx = clamp(target.x, 0, Math.max(0, vw - target.w))
      const ny = clamp(target.y, 26, Math.max(26, vh - target.h - 40))
      animate(x, nx, { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 })
      animate(y, ny, { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 })
      animate(w, target.w, { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 })
      animate(h, target.h, { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 })
      wasMaximized.current = false
    } else if (!win.minimized) {
      const maxW = vw - 8
      const maxH = vh - 26 - 64
      const cw = Math.min(w.get(), maxW)
      const ch = Math.min(h.get(), maxH)
      if (cw !== w.get() || ch !== h.get()) {
        animate(w, cw, { duration: 0.2, ease: [0.32, 0.72, 0, 1] })
        animate(h, ch, { duration: 0.2, ease: [0.32, 0.72, 0, 1] })
      }
      const nx = clamp(x.get(), Math.min(0, vw - cw), Math.max(0, vw - cw))
      const ny = clamp(y.get(), 26, Math.max(26, vh - 50))
      if (nx !== x.get()) animate(x, nx, { duration: 0.2, ease: [0.32, 0.72, 0, 1] })
      if (ny !== y.get()) animate(y, ny, { duration: 0.2, ease: [0.32, 0.72, 0, 1] })
    }
  }, [win.maximized, viewport, x, y, w, h, win.minimized])

  const startDrag = (e: ReactPointerEvent) => {
    if (win.maximized || e.button !== 0) return
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return
    e.preventDefault()
    onFocus(win.id)
    setDragging(true)
    const start = { px: e.clientX, py: e.clientY, x: x.get(), y: y.get() }
    const vw = window.innerWidth
    const vh = window.innerHeight
    const cw = w.get()
    const ch = h.get()
    const minX = Math.min(0, vw - cw)
    const maxX = Math.max(0, vw - cw)
    const maxY = Math.max(26, vh - 46)

    const onMove = (ev: PointerEvent) => {
      const nx = clamp(start.x + ev.clientX - start.px, minX, maxX)
      const ny = clamp(start.y + ev.clientY - start.py, 26, maxY)
      x.set(nx)
      y.set(ny)
    }
    const onUp = () => {
      setDragging(false)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      normalRect.current = { x: x.get(), y: y.get(), w: w.get(), h: h.get() }
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  const originX = (win.originX ?? viewport.w / 2) - x.get()
  const originY = (win.originY ?? viewport.h) - y.get()

  const handleClose = (e: ReactMouseEvent) => {
    e.stopPropagation()
    setClosing(true)
    onClose(win.id)
  }

  return (
    <motion.div
      data-window-id={win.id}
      data-app-id={win.appId}
      className="absolute left-0 top-0"
      style={{
        x,
        y,
        width: w,
        height: h,
        zIndex: win.z,
        pointerEvents: win.minimized || closing ? 'none' : 'auto',
      }}
      onPointerDownCapture={() => onFocus(win.id)}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.08 }}
        animate={
          win.minimized
            ? { opacity: 0, scale: 0.09, y: 0, filter: 'blur(2px)' }
            : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
        }
        exit={{ opacity: 0, scale: 0.06, filter: 'blur(1.5px)' }}
        transition={
          win.minimized
            ? { duration: 0.26, ease: [0.4, 0, 1, 1] }
            : { type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }
        }
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: `${originX}px ${originY}px`,
          transformPerspective: 1400,
          pointerEvents: win.minimized || closing ? 'none' : 'auto',
        }}
        className="origin-center"
      >
        <div
          className={`flex h-full w-full flex-col overflow-hidden ${
            win.maximized ? 'rounded-none' : 'window-radius'
          } ${active ? 'window-shadow-active' : 'window-shadow-inactive'}`}
          style={{
            background: dark ? 'rgba(26,26,28,0.98)' : 'rgba(246,246,248,0.97)',
            border: dark ? '0.5px solid rgba(255,255,255,0.14)' : '0.5px solid rgba(0,0,0,0.12)',
          }}
        >
          <div
            className="traffic-group relative flex h-[38px] shrink-0 items-center px-[12px]"
            style={{
              background: dark
                ? active
                  ? 'linear-gradient(180deg, rgba(44,44,46,0.99), rgba(34,34,36,0.98))'
                  : 'linear-gradient(180deg, rgba(39,39,41,0.99), rgba(31,31,33,0.98))'
                : active
                  ? 'linear-gradient(180deg, rgba(250,250,252,0.98), rgba(240,240,243,0.97))'
                  : 'linear-gradient(180deg, rgba(248,248,250,0.98), rgba(240,240,242,0.97))',
              borderBottom: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.11)',
              cursor: win.maximized ? 'default' : dragging ? 'grabbing' : 'default',
              touchAction: 'none',
            }}
            onPointerDown={startDrag}
            onDoubleClick={() => onToggleMaximize(win.id)}
          >
            <div className="flex items-center gap-[8px]" data-no-drag>
              <TrafficLight
                color={active ? '#ff5f57' : dark ? '#4c4c4e' : '#d6d6d8'}
                stroke={active ? '#7a0c05' : dark ? '#9b9b9f' : '#9b9b9d'}
                label="Close window"
                onClick={handleClose}
                glyph="close"
              />
              <TrafficLight
                color={active ? '#febc2e' : dark ? '#4c4c4e' : '#d6d6d8'}
                stroke={active ? '#8a5a00' : dark ? '#9b9b9f' : '#9b9b9d'}
                label="Minimize window"
                onClick={(e) => {
                  e.stopPropagation()
                  onMinimize(win.id)
                }}
                glyph="minimize"
              />
              <TrafficLight
                color={active ? '#28c840' : dark ? '#4c4c4e' : '#d6d6d8'}
                stroke={active ? '#0a5c13' : dark ? '#9b9b9f' : '#9b9b9d'}
                label="Zoom window"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleMaximize(win.id)
                }}
                glyph="maximize"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 flex justify-center">
              <span
                className={`max-w-[55%] truncate text-[13px] font-semibold tracking-[-0.12px] ${
                  dark
                    ? active
                      ? 'text-white/90'
                      : 'text-white/40'
                    : active
                      ? 'text-[#3a3a3c]'
                      : 'text-[#98989d]'
                }`}
              >
                {win.title}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-[6px]" data-no-drag>
              {active && (
                <span
                  className={`h-[7px] w-[7px] rounded-full ${dark ? 'bg-white/10' : 'bg-black/[0.08]'}`}
                />
              )}
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TrafficLight({
  color,
  stroke,
  label,
  onClick,
  glyph,
}: {
  color: string
  stroke: string
  label: string
  onClick: (e: ReactMouseEvent) => void
  glyph: 'close' | 'minimize' | 'maximize'
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-no-drag
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      className="traffic-light group/light"
      style={{
        background: color,
        border: `0.5px solid ${stroke}55`,
        boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.35)',
      }}
    >
      <svg viewBox="0 0 10 10" className="h-[8px] w-[8px]" aria-hidden>
        {glyph === 'close' && (
          <path d="M2.6 2.6L7.4 7.4M7.4 2.6L2.6 7.4" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
        )}
        {glyph === 'minimize' && (
          <path d="M2.2 5H7.8" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
        )}
        {glyph === 'maximize' && (
          <>
            <path d="M3.1 6.9V3.1H6.9" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M6.9 3.1L3.1 6.9" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
          </>
        )}
      </svg>
    </button>
  )
}

