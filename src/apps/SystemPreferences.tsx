import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Check,
  ChevronRight,
  Info,
  Keyboard,
  LayoutGrid,
  Monitor,
  Search,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Volume2,
  Waves,
} from 'lucide-react'
import { WALLPAPERS, Wallpaper } from '../components/Wallpaper'
import type { DockSettings } from '../types'

export type PaneId = 'desktop' | 'dock' | 'display' | 'sound' | 'mission' | 'general' | 'notifications' | 'security'

const PANES: {
  id: PaneId
  label: string
  icon: ReactNode
  color: string
  group: string
}[] = [
  { id: 'general', label: 'General', icon: <Info className="h-[13px] w-[13px]" />, color: '#8e8e93', group: 'top' },
  { id: 'desktop', label: 'Desktop & Screen Saver', icon: <Monitor className="h-[13px] w-[13px]" />, color: '#0a84ff', group: 'main' },
  { id: 'dock', label: 'Dock & Menu Bar', icon: <LayoutGrid className="h-[13px] w-[13px]" />, color: '#0a84ff', group: 'main' },
  { id: 'mission', label: 'Mission Control', icon: <Sparkles className="h-[13px] w-[13px]" />, color: '#3c3c43', group: 'main' },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="h-[13px] w-[13px]" />, color: '#ff3b30', group: 'main' },
  { id: 'display', label: 'Displays', icon: <Sun className="h-[13px] w-[13px]" />, color: '#0a84ff', group: 'hardware' },
  { id: 'sound', label: 'Sound', icon: <Volume2 className="h-[13px] w-[13px]" />, color: '#ff3b30', group: 'hardware' },
  { id: 'security', label: 'Security & Privacy', icon: <Shield className="h-[13px] w-[13px]" />, color: '#636366', group: 'hardware' },
]

interface SystemPreferencesProps {
  wallpaper: string
  onWallpaperChange: (id: string) => void
  dockSettings: DockSettings
  onDockSettings: (patch: Partial<DockSettings>) => void
  brightness: number
  volume: number
  onBrightness: (v: number) => void
  onVolume: (v: number) => void
  onMissionControl: () => void
  initialPane?: PaneId
}

export function SystemPreferences({
  wallpaper,
  onWallpaperChange,
  dockSettings,
  onDockSettings,
  brightness,
  volume,
  onBrightness,
  onVolume,
  onMissionControl,
  initialPane,
}: SystemPreferencesProps) {
  const [pane, setPane] = useState<PaneId>(initialPane ?? 'desktop')
  useEffect(() => {
    if (initialPane) setPane(initialPane)
  }, [initialPane])
  const [query, setQuery] = useState('')
  const filtered = useMemo(
    () => PANES.filter((p) => p.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  )
  const current = PANES.find((p) => p.id === pane)!

  return (
    <div className="flex h-full min-h-0 bg-[#f6f6f8] text-[#1d1d1f]">
      <aside className="hidden w-[212px] shrink-0 flex-col border-r border-black/[0.08] bg-[#eef0f3]/80 px-[8px] pt-[9px] backdrop-blur-xl sm:flex">
        <div className="mb-[10px] flex items-center gap-[8px] rounded-[6px] px-[7px] py-[5px] hover:bg-black/[0.045]">
          <div className="grid h-[28px] w-[28px] place-items-center rounded-full bg-gradient-to-br from-[#ff9f43] to-[#ff5f6d] text-[11px] font-bold text-white shadow-sm">
            R
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11.5px] font-semibold leading-[14px]">Rizky</p>
            <p className="truncate text-[9.5px] text-black/40">Apple ID, iCloud, Media</p>
          </div>
          <ChevronRight className="ml-auto h-[11px] w-[11px] text-black/25" />
        </div>
        <label className="mb-[9px] flex h-[25px] items-center gap-[5px] rounded-[6px] border border-black/[0.08] bg-white/60 px-[7px]">
          <Search className="h-[11px] w-[11px] text-black/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[11px] outline-none placeholder:text-black/35"
          />
        </label>

        <div className="min-h-0 flex-1 overflow-y-auto pb-3">
          {filtered.map((item, i) => (
            <div key={item.id}>
              {i > 0 && filtered[i - 1].group !== item.group && item.group !== 'top' && (
                <div className="mx-[9px] my-[5px] h-px bg-black/[0.09]" />
              )}
              <button
                onClick={() => setPane(item.id)}
                className={`mb-[1px] flex h-[26px] w-full items-center gap-[7px] rounded-[5px] px-[7px] text-left text-[11.5px] ${
                  pane === item.id ? 'bg-[#0a84ff] text-white' : 'text-[#3a3a3c] hover:bg-black/[0.05]'
                }`}
              >
                <span
                  className="grid h-[17px] w-[17px] shrink-0 place-items-center rounded-[4px] text-white"
                  style={{ background: item.color }}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-2 py-4 text-center text-[10.5px] text-black/35">No results</p>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[42px] shrink-0 items-center border-b border-black/[0.08] bg-[#fbfbfd]/85 px-[16px] backdrop-blur-xl">
          <h1 className="text-[13px] font-semibold tracking-[-0.15px]">{current.label}</h1>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-[18px] sm:p-[24px]">
          {pane === 'desktop' && (
            <DesktopPane wallpaper={wallpaper} onWallpaperChange={onWallpaperChange} />
          )}
          {pane === 'dock' && (
            <DockPane settings={dockSettings} onChange={onDockSettings} />
          )}
          {pane === 'display' && (
            <DisplayPane brightness={brightness} onBrightness={onBrightness} />
          )}
          {pane === 'sound' && <SoundPane volume={volume} onVolume={onVolume} />}
          {pane === 'mission' && <MissionPane onMissionControl={onMissionControl} />}
          {pane === 'general' && <GeneralPane />}
          {pane === 'notifications' && <NotificationsPane />}
          {pane === 'security' && <SecurityPane />}
        </div>
      </div>
    </div>
  )
}

function Group({ title, children, footer }: { title?: string; children: ReactNode; footer?: string }) {
  return (
    <section className="mb-[22px]">
      {title && <h2 className="mb-[7px] text-[11.5px] font-semibold text-black/55">{title}</h2>}
      <div className="overflow-hidden rounded-[9px] border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {children}
      </div>
      {footer && <p className="mt-[6px] px-[3px] text-[9.5px] leading-[13px] text-black/35">{footer}</p>}
    </section>
  )
}

function Row({
  label,
  children,
  last,
}: {
  label: ReactNode
  children?: ReactNode
  last?: boolean
}) {
  return (
    <div
      className={`flex min-h-[38px] items-center justify-between gap-[12px] px-[12px] py-[7px] ${
        last ? '' : 'border-b border-black/[0.07]'
      }`}
    >
      <div className="min-w-0 text-[11.5px] text-[#2b2b2e]">{label}</div>
      <div className="flex shrink-0 items-center gap-[8px]">{children}</div>
    </div>
  )
}

function MacSwitch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-[20px] w-[34px] shrink-0 rounded-full transition-colors duration-200 ${
        on ? 'bg-[#0a84ff]' : 'bg-black/[0.14]'
      }`}
    >
      <motion.span
        animate={{ x: on ? 14 : 0 }}
        transition={{ type: 'spring', stiffness: 640, damping: 36, mass: 0.7 }}
        className="absolute left-[2px] top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
      />
    </button>
  )
}

function MacSlider({
  value,
  onChange,
  label,
  leading,
  trailing,
}: {
  value: number
  onChange: (v: number) => void
  label: string
  leading?: ReactNode
  trailing?: ReactNode
}) {
  const [track, setTrack] = useState<HTMLDivElement | null>(null)

  const update = (clientX: number) => {
    if (!track) return
    const rect = track.getBoundingClientRect()
    const next = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    onChange(Math.round(next))
  }

  return (
    <div className="flex items-center gap-[8px]">
      {leading && <span className="text-black/40">{leading}</span>}
      <div className="relative flex h-[22px] flex-1 items-center">
        <div
          ref={setTrack}
          role="slider"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          tabIndex={0}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            update(e.clientX)
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) update(e.clientX)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 5))
            if (e.key === 'ArrowRight') onChange(Math.min(100, value + 5))
          }}
          className="relative h-[20px] w-full cursor-pointer touch-none outline-none"
        >
          <div className="absolute inset-x-0 top-[9px] h-[3px] rounded-full bg-black/[0.14]" />
          <div
            className="absolute left-0 top-[9px] h-[3px] rounded-full bg-[#0a84ff]"
            style={{ width: `${value}%` }}
          />
          <span
            className="absolute top-[2px] h-[16px] w-[16px] -translate-x-1/2 rounded-full border border-black/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.24)]"
            style={{ left: `${value}%` }}
          />
        </div>
      </div>
      {trailing && <span className="text-black/40">{trailing}</span>}
    </div>
  )
}

function DesktopPane({
  wallpaper,
  onWallpaperChange,
}: {
  wallpaper: string
  onWallpaperChange: (id: string) => void
}) {
  const [dynamic, setDynamic] = useState(true)
  return (
    <>
      <Group
        title="Desktop Picture"
        footer="Choose a picture to display on your desktop. The selection is applied immediately."
      >
        <div className="grid grid-cols-2 gap-[10px] p-[12px] sm:grid-cols-3">
          {WALLPAPERS.map((wp) => {
            const active = wallpaper === wp.id
            return (
              <button key={wp.id} onClick={() => onWallpaperChange(wp.id)} className="group text-left">
                <div
                  className={`relative aspect-[16/10] overflow-hidden rounded-[6px] border-2 transition-all ${
                    active ? 'border-[#0a84ff] shadow-[0_0_0_2px_rgba(10,132,255,0.18)]' : 'border-transparent group-hover:border-black/15'
                  }`}
                >
                  <Wallpaper variant={wp.id} className="absolute inset-0 h-full w-full" />
                  {active && (
                    <span className="absolute right-[5px] top-[5px] grid h-[16px] w-[16px] place-items-center rounded-full bg-[#0a84ff] text-white shadow">
                      <Check className="h-[10px] w-[10px]" strokeWidth={3.4} />
                    </span>
                  )}
                </div>
                <p className="mt-[5px] truncate text-[10.5px] font-medium text-[#3a3a3c]">{wp.name}</p>
                <p className="text-[9px] text-black/35">{wp.subtitle}</p>
              </button>
            )
          })}
        </div>
      </Group>
      <Group title="Options">
        <Row label="Dynamic Desktop" last>
          <MacSwitch on={dynamic} onChange={setDynamic} label="Dynamic Desktop" />
        </Row>
      </Group>
      <Group title="Screen Saver">
        <div className="flex items-center gap-[12px] p-[12px]">
          <div className="relative h-[54px] w-[86px] overflow-hidden rounded-[5px] bg-black">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#ff8a5c]/40 via-[#ff5f7a]/30 to-[#1e3a8a]/40" />
            <Waves className="absolute left-1/2 top-1/2 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 text-white/50" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-medium">Big Sur</p>
            <p className="mt-[2px] text-[9.5px] text-black/40">Start after 5 minutes of inactivity</p>
          </div>
          <button className="rounded-[6px] border border-black/10 bg-white px-[9px] py-[3px] text-[10.5px] font-medium text-[#3a3a3c] hover:bg-black/[0.03]">
            Screen Saver…
          </button>
        </div>
      </Group>
    </>
  )
}

function DockPane({
  settings,
  onChange,
}: {
  settings: DockSettings
  onChange: (patch: Partial<DockSettings>) => void
}) {
  const [indicators, setIndicators] = useState(true)
  const [autoMenu, setAutoMenu] = useState(false)
  return (
    <>
      <Group title="Dock">
        <Row label="Size">
          <div className="flex w-[180px] items-center gap-[6px] text-black/40">
            <span className="text-[9px]">Small</span>
            <div className="flex-1">
              <MacSlider value={settings.size} onChange={(size) => onChange({ size })} label="Dock size" />
            </div>
            <span className="text-[13px]">Large</span>
          </div>
        </Row>
        <Row label="Magnification">
          <MacSwitch
            on={settings.magnification}
            onChange={(magnification) => onChange({ magnification })}
            label="Magnification"
          />
        </Row>
        <Row label="Automatically hide and show the Dock" last>
          <MacSwitch
            on={settings.autoHide}
            onChange={(autoHide) => onChange({ autoHide })}
            label="Automatically hide and show the Dock"
          />
        </Row>
      </Group>
      <Group title="Menu Bar">
        <Row label="Show indicators for open applications">
          <MacSwitch on={indicators} onChange={setIndicators} label="Show indicators" />
        </Row>
        <Row label="Automatically hide and show the menu bar" last>
          <MacSwitch on={autoMenu} onChange={setAutoMenu} label="Auto hide menu bar" />
        </Row>
      </Group>
      <p className="px-[3px] text-[9.5px] leading-[14px] text-black/35">
        Size and auto-hide changes are applied to the desktop immediately. Drag the slider to feel the
        magnification response.
      </p>
    </>
  )
}

function DisplayPane({ brightness, onBrightness }: { brightness: number; onBrightness: (v: number) => void }) {
  const [auto, setAuto] = useState(true)
  const [trueTone, setTrueTone] = useState(true)
  return (
    <>
      <Group title="Display">
        <Row label="Brightness">
          <div className="flex w-[190px] items-center gap-[6px]">
            <Sun className="h-[12px] w-[12px] text-black/40" />
            <div className="flex-1">
              <MacSlider value={brightness} onChange={onBrightness} label="Brightness" />
            </div>
            <Sun className="h-[15px] w-[15px] text-black/40" />
          </div>
        </Row>
        <Row label="Automatically adjust brightness">
          <MacSwitch on={auto} onChange={setAuto} label="Automatically adjust brightness" />
        </Row>
        <Row label="True Tone" last>
          <MacSwitch on={trueTone} onChange={setTrueTone} label="True Tone" />
        </Row>
      </Group>
      <Group title="Resolution">
        <Row label="Default for display" last>
          <span className="text-[10.5px] text-black/40">2560 × 1600 Retina</span>
        </Row>
      </Group>
      <Group title="Color Profile">
        <Row label="Color LCD" last>
          <ChevronRight className="h-[12px] w-[12px] text-black/30" />
        </Row>
      </Group>
    </>
  )
}

function SoundPane({ volume, onVolume }: { volume: number; onVolume: (v: number) => void }) {
  const [startup, setStartup] = useState(true)
  const [effects, setEffects] = useState(true)
  const [device, setDevice] = useState('MacBook Pro Speakers')
  return (
    <>
      <Group title="Output">
        <Row label="Output volume">
          <div className="flex w-[190px] items-center gap-[6px]">
            <Volume2 className="h-[12px] w-[12px] text-black/40" />
            <div className="flex-1">
              <MacSlider value={volume} onChange={onVolume} label="Output volume" />
            </div>
            <Volume2 className="h-[15px] w-[15px] text-black/40" />
          </div>
        </Row>
        <Row label="Play sound on startup">
          <MacSwitch on={startup} onChange={setStartup} label="Play sound on startup" />
        </Row>
        <Row label="Play user interface sound effects" last>
          <MacSwitch on={effects} onChange={setEffects} label="Interface sound effects" />
        </Row>
      </Group>
      <Group title="Output Device">
        {['MacBook Pro Speakers', 'AirPods Pro', 'Studio Display Speakers'].map((d, i) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={`flex w-full items-center gap-[8px] px-[12px] py-[7px] text-left text-[11px] ${
              i < 2 ? 'border-b border-black/[0.07]' : ''
            } hover:bg-black/[0.02]`}
          >
            <Check className={`h-[11px] w-[11px] ${device === d ? 'text-[#0a84ff]' : 'text-transparent'}`} strokeWidth={3} />
            <span>{d}</span>
            {d === 'AirPods Pro' && <span className="ml-auto text-[9px] text-black/35">Bluetooth</span>}
          </button>
        ))}
      </Group>
    </>
  )
}

function MissionPane({ onMissionControl }: { onMissionControl: () => void }) {
  const [grouped, setGrouped] = useState(true)
  const [displays, setDisplays] = useState(false)
  return (
    <>
      <Group title="Mission Control">
        <div className="flex items-center gap-[14px] p-[14px]">
          <div className="relative grid h-[64px] w-[100px] shrink-0 place-items-center overflow-hidden rounded-[7px] bg-gradient-to-br from-[#1e2a44] to-[#0c1322]">
            <div className="grid grid-cols-3 gap-[3px]">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="h-[12px] w-[19px] rounded-[2px] border border-white/20 bg-white/10 backdrop-blur-sm" />
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold">See every window at a glance</p>
            <p className="mt-[3px] text-[10px] leading-[15px] text-black/45">
              Mission Control shrinks all open windows into a single, organized view.
            </p>
            <button
              onClick={onMissionControl}
              className="mt-[8px] rounded-[6px] bg-[#0a84ff] px-[11px] py-[4px] text-[10.5px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
            >
              Open Mission Control
            </button>
          </div>
        </div>
      </Group>
      <Group title="Spaces">
        <Row label="Automatically rearrange Spaces based on most recent use">
          <MacSwitch on onChange={() => {}} label="Rearrange spaces" />
        </Row>
        <Row label="When switching to an application, switch to a Space with open windows">
          <MacSwitch on onChange={() => {}} label="Switch spaces" />
        </Row>
        <Row label="Group windows by application" last>
          <MacSwitch on={grouped} onChange={setGrouped} label="Group windows" />
        </Row>
      </Group>
      <Group title="Keyboard and Mouse Shortcuts">
        <Row label="Mission Control">
          <span className="rounded-[4px] border border-black/10 bg-black/[0.03] px-[6px] py-[1px] text-[10px] text-black/55">⌃ ↑</span>
        </Row>
        <Row label="Show Desktop">
          <span className="rounded-[4px] border border-black/10 bg-black/[0.03] px-[6px] py-[1px] text-[10px] text-black/55">F11</span>
        </Row>
        <Row label="Displays have separate Spaces" last>
          <MacSwitch on={displays} onChange={setDisplays} label="Separate Spaces" />
        </Row>
      </Group>
    </>
  )
}

function GeneralPane() {
  const [checking, setChecking] = useState(false)
  return (
    <>
      <Group title="About">
        <div className="flex flex-col items-center px-[14px] py-[18px] text-center sm:flex-row sm:text-left">
          <div className="relative mb-3 flex h-[84px] w-[120px] shrink-0 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#2a2a2e] to-[#0b0b0d] shadow-lg sm:mb-0">
            <div className="h-[52px] w-[88px] rounded-[3px] border border-white/20 bg-gradient-to-br from-[#ff9a6b] via-[#a24a8f] to-[#243a6b]" />
            <div className="absolute -bottom-[2px] h-[4px] w-[104px] rounded-b-[4px] bg-[#3d3d42]" />
          </div>
          <div className="min-w-0 sm:ml-[18px]">
            <h2 className="text-[16px] font-semibold tracking-[-0.3px]">MacBook Pro</h2>
            <p className="text-[10.5px] text-black/40">13-inch, M1, 2020</p>
            <div className="mt-[8px] space-y-[3px] text-[10.5px] leading-[15px] text-black/55">
              <p>Chip: Apple M1</p>
              <p>Memory: 16 GB</p>
              <p>Startup Disk: Macintosh HD</p>
              <p>macOS Big Sur 11.7.10</p>
            </div>
          </div>
          <button
            onClick={() => {
              setChecking(true)
              window.setTimeout(() => setChecking(false), 1800)
            }}
            className="ml-auto mt-3 self-center rounded-[6px] border border-black/10 bg-white px-[10px] py-[3px] text-[10.5px] font-medium text-[#0a84ff] hover:bg-black/[0.03] sm:mt-0"
          >
            {checking ? 'Checking…' : 'Software Update…'}
          </button>
        </div>
      </Group>
      <Group title="System">
        <Row label="Name">
          <span className="text-[10.5px] text-black/45">Rizky’s MacBook Pro</span>
        </Row>
        <Row label="Serial Number">
          <span className="text-[10.5px] text-black/45">C02BIGSUR2020</span>
        </Row>
        <Row label="Storage" last>
          <span className="text-[10.5px] text-black/45">128.4 GB available of 512 GB</span>
        </Row>
      </Group>
      <div className="flex justify-end">
        <button className="rounded-[6px] border border-black/10 bg-white px-[11px] py-[3px] text-[10.5px] text-black/55 hover:bg-black/[0.03]">
          System Report…
        </button>
      </div>
    </>
  )
}

function NotificationsPane() {
  const [dnd, setDnd] = useState(false)
  const [allow, setAllow] = useState(true)
  return (
    <>
      <Group title="Do Not Disturb">
        <Row label="While the display is sleeping">
          <MacSwitch on={dnd} onChange={setDnd} label="Do not disturb" />
        </Row>
        <Row label="Allow calls from Everyone" last>
          <MacSwitch on={allow} onChange={setAllow} label="Allow calls" />
        </Row>
      </Group>
      <Group title="Application Notifications">
        {[
          { name: 'Mail', desc: 'Banners', color: '#0a84ff' },
          { name: 'Calendar', desc: 'Alerts', color: '#ff453a' },
          { name: 'Messages', desc: 'Banners', color: '#30d158' },
          { name: 'Photos', desc: 'Off', color: '#ff9f0a' },
        ].map((app, i, arr) => (
          <Row key={app.name} label={<span className="flex items-center gap-[7px]"><span className="h-[8px] w-[8px] rounded-[2px]" style={{ background: app.color }} />{app.name}</span>} last={i === arr.length - 1}>
            <span className="text-[10px] text-black/35">{app.desc}</span>
          </Row>
        ))}
      </Group>
    </>
  )
}

function SecurityPane() {
  const [fileVault, setFileVault] = useState(true)
  const [lockdown, setLockdown] = useState(false)
  return (
    <>
      <Group title="FileVault">
        <Row label="FileVault is turned on for the disk “Macintosh HD”." last>
          <MacSwitch on={fileVault} onChange={setFileVault} label="FileVault" />
        </Row>
      </Group>
      <Group title="Firewall">
        <Row label="Firewall: On" last>
          <span className="text-[10.5px] text-black/40">Blocking incoming connections</span>
        </Row>
      </Group>
      <Group title="Privacy">
        <Row label="Lockdown Mode" last>
          <MacSwitch on={lockdown} onChange={setLockdown} label="Lockdown Mode" />
        </Row>
      </Group>
    </>
  )
}
