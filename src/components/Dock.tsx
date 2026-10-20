import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { motion } from 'framer-motion'
import type { AppId, DockSettings } from '../types'
import { APP_META, visibleDockApps } from '../data/apps'
import { DockIcon } from './DockIcon'

interface DockProps {
  openApps: Set<AppId>
  activeApp: AppId | null
  settings: DockSettings
  onOpen: (appId: AppId, rect: DOMRect) => void
}

type DockItem = { type: 'app'; id: AppId } | { type: 'divider' }

export function Dock({ openApps, activeApp, settings, onOpen }: DockProps) {
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1440))
  const [pointerX, setPointerX] = useState<number | null>(null)
  const [hidden, setHidden] = useState(false)
  const frame = useRef<number | null>(null)
  const hideTimer = useRef<number | null>(null)
  const overDock = useRef(false)

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const compact = vw < 700
  const dockApps = useMemo(() => visibleDockApps(vw), [vw])
  const n = dockApps.length
  const gap = vw < 700 ? 2 : 4
  const pad = vw < 700 ? 5 : 6
  const dividerW = vw < 700 ? 12 : 15

  const reserve = compact ? 1.06 : 2.35
  const rawSize =
    (vw - (compact ? 26 : 74)) / (n + (n - 1) * (gap / 52) + reserve)
  const size = Math.round(Math.max(26, Math.min(settings.size, rawSize, 60)))

  const items: DockItem[] = useMemo(() => {
    const list: DockItem[] = []
    dockApps.forEach((id) => {
      if (id === 'downloads') list.push({ type: 'divider' })
      list.push({ type: 'app', id })
    })
    return list
  }, [dockApps])

  // base centers, derived from the un-magnified centered layout
  const geometry = useMemo(() => {
    let x = pad
    const centers = new Map<AppId, number>()
    for (const item of items) {
      if (item.type === 'divider') {
        x += dividerW + gap
      } else {
        centers.set(item.id, x + size / 2)
        x += size + gap
      }
    }
    const baseWidth = x - gap + pad
    const baseLeft = vw / 2 - baseWidth / 2
    return { centers, baseLeft }
  }, [items, size, gap, pad, dividerW, vw])

  const scales = useMemo(() => {
    const map = new Map<AppId, number>()
    const allowMagnify = settings.magnification && !compact && pointerX !== null
    for (const app of dockApps) {
      if (!allowMagnify) {
        map.set(app, 1)
        continue
      }
      const center = geometry.baseLeft + (geometry.centers.get(app) ?? 0)
      const d = Math.abs((pointerX as number) - center)
      const influence = Math.exp(-Math.pow(d / (size * 1.85), 2))
      map.set(app, 1 + 0.8 * influence)
    }
    return map
  }, [dockApps, geometry, pointerX, settings.magnification, compact, size])

  // derive the tooltip target from pointer position so magnification reflow
  // cannot leave a tooltip stuck on a neighbouring icon
  const hovered = useMemo<AppId | null>(() => {
    if (pointerX === null) return null
    let best: AppId | null = null
    let bestDistance = Infinity
    for (const app of dockApps) {
      const center = geometry.baseLeft + (geometry.centers.get(app) ?? 0)
      const distance = Math.abs(pointerX - center)
      if (distance < bestDistance) {
        bestDistance = distance
        best = app
      }
    }
    return bestDistance <= size * 0.72 ? best : null
  }, [dockApps, geometry, pointerX, size])

  useEffect(() => {
    if (!settings.autoHide) {
      setHidden(false)
      return
    }
    const id = window.setTimeout(() => {
      if (!overDock.current) setHidden(true)
    }, 1100)
    return () => window.clearTimeout(id)
  }, [settings.autoHide])

  useEffect(() => {
    if (!settings.autoHide) return
    const onMove = (e: PointerEvent) => {
      if (e.clientY >= window.innerHeight - 5) {
        setHidden(false)
      }
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [settings.autoHide])

  const handlePointerMove = useCallback((e: ReactPointerEvent) => {
    const clientX = e.clientX
    if (frame.current !== null) return
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null
      setPointerX(clientX)
    })
  }, [])

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    },
    [],
  )

  const clearHideTimer = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }

  const handleEnter = () => {
    overDock.current = true
    clearHideTimer()
    setHidden(false)
  }

  const handleLeave = () => {
    overDock.current = false
    setPointerX(null)
    if (settings.autoHide) {
      clearHideTimer()
      hideTimer.current = window.setTimeout(() => setHidden(true), 460)
    }
  }

  return (
    <>
      {/* reveal hotspot for auto-hide */}
      {settings.autoHide && (
        <div
          className="fixed inset-x-0 bottom-0 z-[7900] h-[7px]"
          onPointerEnter={() => setHidden(false)}
        />
      )}

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[8000] flex justify-center"
        style={{ paddingBottom: 6 }}
      >
        <motion.div
          data-dock
          initial={false}
          animate={{ y: hidden ? 150 : 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
          onPointerEnter={handleEnter}
          onPointerLeave={handleLeave}
          onPointerMove={handlePointerMove}
          className="pointer-events-auto relative"
          style={{ touchAction: 'none' }}
        >
          <div
            className="relative flex items-end"
            style={{
              gap,
              padding: pad,
              borderRadius: vw < 700 ? 17 : 21,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.17) 55%, rgba(255,255,255,0.21) 100%)',
              border: '0.5px solid rgba(255,255,255,0.42)',
              boxShadow:
                '0 10px 34px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.16), inset 0 0.5px 0 rgba(255,255,255,0.5)',
              backdropFilter: 'blur(30px) saturate(185%)',
              WebkitBackdropFilter: 'blur(30px) saturate(185%)',
            }}
          >
            {items.map((item, i) =>
              item.type === 'divider' ? (
                <div
                  key={`divider-${i}`}
                  className="flex shrink-0 items-end justify-center"
                  style={{ width: dividerW, height: Math.round(size * 0.82), marginBottom: size * 0.09 }}
                >
                  <span
                    className="h-full w-px rounded-full"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.5), rgba(0,0,0,0.16))',
                    }}
                  />
                </div>
              ) : (
                <DockIcon
                  key={item.id}
                  appId={item.id}
                  size={size}
                  scale={scales.get(item.id) ?? 1}
                  running={openApps.has(item.id)}
                  active={activeApp === item.id}
                  onOpen={onOpen}
                  tooltipVisible={hovered === item.id}
                />
              ),
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}
