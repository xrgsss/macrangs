import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Image, LayoutGrid, Lock, Moon, Search, Settings, Sparkles } from 'lucide-react'
import { APP_ICONS } from './AppIcons'
import { APP_META, DOCK_ORDER } from '../data/apps'
import type { AppId } from '../types'

type SpotlightAction = 'wallpaper' | 'mission' | 'settings' | 'lock' | 'sleep'

interface SpotlightProps {
  onClose: () => void
  onOpenApp: (appId: AppId) => void
  onAction: (action: SpotlightAction) => void
}

interface Result {
  id: string
  label: string
  subtitle: string
  icon: ReactNode
  run: () => void
  group: 'Apps' | 'Actions'
}

const ACTION_DEFS: {
  id: SpotlightAction
  label: string
  subtitle: string
  icon: ReactNode
}[] = [
  { id: 'wallpaper', label: 'Change Wallpaper', subtitle: 'Desktop & Screen Saver', icon: <Image className="h-[18px] w-[18px]" /> },
  { id: 'mission', label: 'Mission Control', subtitle: 'See all open windows', icon: <LayoutGrid className="h-[18px] w-[18px]" /> },
  { id: 'settings', label: 'System Preferences', subtitle: 'System settings', icon: <Settings className="h-[18px] w-[18px]" /> },
  { id: 'sleep', label: 'Sleep', subtitle: 'Put the Mac to sleep', icon: <Moon className="h-[18px] w-[18px]" /> },
  { id: 'lock', label: 'Lock Screen', subtitle: 'Lock this Mac', icon: <Lock className="h-[18px] w-[18px]" /> },
]

export function Spotlight({ onClose, onOpenApp, onAction }: SpotlightProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase()
    const apps = DOCK_ORDER.filter((id) => id !== 'launchpad' && id !== 'downloads' && id !== 'trash')
      .filter((id) => !q || APP_META[id].name.toLowerCase().includes(q))
      .map<Result>((id) => ({
        id,
        label: APP_META[id].name,
        subtitle: 'Application',
        icon: (() => {
          const Glyph = APP_ICONS[id]
          return <Glyph className="h-[25px] w-[25px]" />
        })(),
        run: () => onOpenApp(id),
        group: 'Apps',
      }))
    const actions = ACTION_DEFS.filter((a) => !q || a.label.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)).map<Result>((a) => ({
      id: a.id,
      label: a.label,
      subtitle: a.subtitle,
      icon: a.icon,
      run: () => onAction(a.id),
      group: 'Actions',
    }))
    return [...apps.slice(0, q ? 6 : 8), ...actions].slice(0, 9)
  }, [query, onOpenApp, onAction])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((i) => (results.length ? (i + 1) % results.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
      } else if (e.key === 'Enter') {
        const result = results[active]
        if (result) {
          e.preventDefault()
          onClose()
          result.run()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onClose, results])

  let lastGroup: Result['group'] | null = null

  return (
    <motion.div
      data-spotlight
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.14 }}
      className="fixed inset-0 z-[9720] flex items-start justify-center bg-black/10 pt-[13vh] backdrop-blur-[2px]"
      onPointerDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -6 }}
        transition={{ type: 'spring', stiffness: 430, damping: 34, mass: 0.8 }}
        onPointerDown={(e) => e.stopPropagation()}
        className="w-[min(600px,calc(100vw-32px))] overflow-hidden rounded-[14px] border border-white/45 text-[#1d1d1f]"
        style={{
          background: 'rgba(244,244,247,0.78)',
          backdropFilter: 'blur(54px) saturate(200%)',
          WebkitBackdropFilter: 'blur(54px) saturate(200%)',
          boxShadow:
            '0 0 0 0.5px rgba(0,0,0,0.2), 0 26px 70px rgba(0,0,0,0.42), 0 6px 18px rgba(0,0,0,0.18)',
        }}
      >
        <div className="flex h-[52px] items-center gap-[10px] border-b border-black/[0.09] px-[16px]">
          <Search className="h-[21px] w-[21px] shrink-0 text-black/40" strokeWidth={2.2} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Spotlight Search"
            spellCheck={false}
            className="w-full bg-transparent text-[19px] font-light tracking-[-0.25px] text-[#1d1d1f] outline-none placeholder:text-black/30"
          />
          <span className="shrink-0 rounded-[4px] border border-black/10 bg-white/50 px-[5px] py-[1px] text-[9.5px] text-black/40">
            esc
          </span>
        </div>

        <div className="max-h-[46vh] overflow-y-auto p-[6px]">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-[7px] px-4 py-10 text-center">
              <Sparkles className="h-[26px] w-[26px] text-black/20" strokeWidth={1.4} />
              <p className="text-[12px] text-black/45">No results for “{query}”</p>
              <p className="text-[10.5px] text-black/30">Try searching for an app or a desktop action.</p>
            </div>
          ) : (
            results.map((result, i) => {
              const showHeader = result.group !== lastGroup
              lastGroup = result.group
              return (
                <div key={`${result.group}-${result.id}`}>
                  {showHeader && (
                    <div className="px-[10px] pb-[3px] pt-[6px] text-[9.5px] font-semibold uppercase tracking-[0.08em] text-black/35">
                      {result.group}
                    </div>
                  )}
                  <button
                    onPointerEnter={() => setActive(i)}
                    onClick={() => {
                      onClose()
                      result.run()
                    }}
                    className={`flex w-full items-center gap-[10px] rounded-[7px] px-[10px] py-[6px] text-left ${
                      active === i ? 'bg-[#0a84ff] text-white' : 'hover:bg-black/[0.045]'
                    }`}
                  >
                    <span className="grid h-[28px] w-[28px] shrink-0 place-items-center">
                      {result.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-medium leading-[16px]">{result.label}</span>
                      <span className={`block truncate text-[10px] ${active === i ? 'text-white/65' : 'text-black/40'}`}>
                        {result.subtitle}
                      </span>
                    </span>
                    {active === i && (
                      <span className="shrink-0 text-[9.5px] text-white/60">↩</span>
                    )}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export type { SpotlightAction }
