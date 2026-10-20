import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight, Search, Wifi, WifiOff } from 'lucide-react'
import { AppleLogo } from './AppIcons'
import { useClock } from '../hooks/useClock'

export type MenuCommand =
  | 'about'
  | 'settings'
  | 'appstore'
  | 'sleep'
  | 'lock'
  | 'close'
  | 'minimize'
  | 'zoom'
  | 'new-finder'
  | 'new-folder'
  | 'mission'
  | 'control-center'
  | 'wallpaper'
  | 'help'
  | 'search'
  | 'none'

interface MenuItemDef {
  type?: 'item' | 'separator'
  label?: string
  shortcut?: string
  command?: MenuCommand
  disabled?: boolean
  checked?: boolean
  submenu?: boolean
}

interface MenuDef {
  id: string
  label: string
  bold?: boolean
  icon?: boolean
  items: MenuItemDef[]
}

function buildMenus(activeApp: string): MenuDef[] {
  return [
    {
      id: 'apple',
      label: 'Apple',
      icon: true,
      items: [
        { label: 'About This Mac', command: 'about' },
        { type: 'separator' },
        { label: 'System Preferences…', command: 'settings' },
        { label: 'App Store…', command: 'appstore' },
        { type: 'separator' },
        { label: 'Recent Items', submenu: true, disabled: true },
        { type: 'separator' },
        { label: 'Sleep', command: 'sleep' },
        { label: 'Restart…', command: 'none' },
        { label: 'Shut Down…', command: 'none' },
        { type: 'separator' },
        { label: 'Lock Screen', shortcut: '⌃⌘Q', command: 'lock' },
        { label: 'Log Out…', shortcut: '⇧⌘Q', command: 'none' },
      ],
    },
    {
      id: 'app',
      label: activeApp,
      bold: true,
      items: [
        { label: `About ${activeApp}`, command: 'about' },
        { type: 'separator' },
        { label: 'Preferences…', shortcut: '⌘,', command: 'settings' },
        { type: 'separator' },
        { label: `Hide ${activeApp}`, shortcut: '⌘H', command: 'none', disabled: true },
        { label: 'Hide Others', shortcut: '⌥⌘H', command: 'none', disabled: true },
        { label: 'Show All', command: 'none', disabled: true },
        { type: 'separator' },
        { label: `Quit ${activeApp}`, shortcut: '⌘Q', command: 'close' },
      ],
    },
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'New Window', shortcut: '⌘N', command: 'new-finder' },
        { label: 'New Folder', shortcut: '⇧⌘N', command: 'new-folder' },
        { type: 'separator' },
        { label: 'Open…', shortcut: '⌘O', command: 'new-finder' },
        { label: 'Close Window', shortcut: '⌘W', command: 'close' },
        { type: 'separator' },
        { label: 'Share…', submenu: true, disabled: true },
        { label: 'Print…', shortcut: '⌘P', command: 'none', disabled: true },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', command: 'none', disabled: true },
        { label: 'Redo', shortcut: '⇧⌘Z', command: 'none', disabled: true },
        { type: 'separator' },
        { label: 'Cut', shortcut: '⌘X', command: 'none', disabled: true },
        { label: 'Copy', shortcut: '⌘C', command: 'none', disabled: true },
        { label: 'Paste', shortcut: '⌘V', command: 'none', disabled: true },
        { label: 'Select All', shortcut: '⌘A', command: 'none', disabled: true },
        { type: 'separator' },
        { label: 'Find', submenu: true, disabled: true },
      ],
    },
    {
      id: 'image',
      label: 'Image',
      items: [
        { label: 'Rotate Left', shortcut: '⌘L', command: 'none', disabled: true },
        { label: 'Rotate Right', shortcut: '⌘R', command: 'none', disabled: true },
        { type: 'separator' },
        { label: 'Zoom In', shortcut: '⌘+', command: 'none', disabled: true },
        { label: 'Zoom Out', shortcut: '⌘−', command: 'none', disabled: true },
        { label: 'Actual Size', shortcut: '⌘0', command: 'none', disabled: true },
        { type: 'separator' },
        { label: 'Change Wallpaper…', command: 'wallpaper' },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'Show Toolbar', checked: true, command: 'none', disabled: true },
        { label: 'Show Sidebar', checked: true, command: 'none', disabled: true },
        { type: 'separator' },
        { label: 'Control Center', command: 'control-center' },
        { label: 'Mission Control', shortcut: '⌃↑', command: 'mission' },
        { type: 'separator' },
        { label: 'Enter Full Screen', shortcut: '⌃⌘F', command: 'zoom' },
      ],
    },
    {
      id: 'window',
      label: 'Window',
      items: [
        { label: 'Minimize', shortcut: '⌘M', command: 'minimize' },
        { label: 'Zoom', command: 'zoom' },
        { type: 'separator' },
        { label: 'Move Window to Left Side of Screen', command: 'none', disabled: true },
        { label: 'Move Window to Right Side of Screen', command: 'none', disabled: true },
        { type: 'separator' },
        { label: 'Bring All to Front', command: 'none', disabled: true },
        { type: 'separator' },
        { label: 'Mission Control', shortcut: '⌃↑', command: 'mission' },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { label: `${activeApp} Help`, command: 'help' },
        { label: 'macOS Help', command: 'help' },
        { type: 'separator' },
        { label: 'See All Windows', command: 'mission' },
      ],
    },
  ]
}

function ControlCenterGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="2.6" y="4.2" width="18.8" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7.6" cy="7.7" r="1.9" fill="currentColor" />
      <rect x="2.6" y="13" width="18.8" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.4" cy="16.5" r="1.9" fill="currentColor" />
    </svg>
  )
}

function BatteryGlyph({ percent = 100 }: { percent?: number }) {
  return (
      <span className="flex items-center gap-[3px]">
      <svg viewBox="0 0 26 13" className="h-[11px] w-[23px]" aria-hidden>
        <rect x="0.7" y="0.7" width="21.5" height="11.6" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.2" />
        <rect x="2.4" y="2.4" width={Math.max(1, (18 * percent) / 100)} height="8.2" rx="1.6" fill="currentColor" />
        <path d="M23.6 4.3C24.5 4.6 25 5.4 25 6.5C25 7.6 24.5 8.4 23.6 8.7V4.3Z" fill="currentColor" fillOpacity="0.65" />
      </svg>
      <span className="tabular hidden text-[11.5px] font-medium tracking-[0.1px] sm:inline">100%</span>
    </span>
  )
}

interface MenuBarProps {
  activeAppName: string
  onCommand: (command: MenuCommand, menuId?: string) => void
  onOpenControlCenter: () => void
  controlCenterOpen: boolean
  onToggleMissionControl: () => void
  hasActiveWindow: boolean
  wifiOn?: boolean
}

export function MenuBar({
  activeAppName,
  onCommand,
  onOpenControlCenter,
  controlCenterOpen,
  onToggleMissionControl,
  hasActiveWindow,
  wifiOn = true,
}: MenuBarProps) {
  const now = useClock()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const menus = buildMenus(activeAppName)

  useEffect(() => {
    if (!openMenu) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (!barRef.current?.contains(target) && !target.closest('[data-menu-dropdown]')) {
        setOpenMenu(null)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [openMenu])

  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeLabel = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const choose = (item: MenuItemDef, menuId: string) => {
    if (item.disabled || !item.command) {
      if (item.submenu) return
      setOpenMenu(null)
      return
    }
    setOpenMenu(null)
    onCommand(item.command, menuId)
  }

  return (
    <div
      ref={barRef}
      data-menubar
      className="menubar-glass fixed left-0 right-0 top-0 z-[9000] flex h-[26px] select-none items-stretch text-white"
      style={{ boxShadow: '0 0.5px 0 rgba(255,255,255,0.09)' }}
    >
      <div className="flex min-w-0 items-stretch pl-[9px]">
        <div className="relative flex items-stretch">
          <button
            className={`my-[3px] flex items-center rounded-[4px] px-[8px] transition-colors duration-100 ${
              openMenu === 'apple' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            onPointerDown={(e) => {
              e.stopPropagation()
              setOpenMenu((v) => (v === 'apple' ? null : 'apple'))
            }}
            onPointerEnter={() => openMenu && setOpenMenu('apple')}
            aria-label="Apple menu"
          >
            <AppleLogo className="mt-[-1.5px] h-[15px] w-[15px] text-white" />
          </button>
          <AnimatePresence>
            {openMenu === 'apple' && (
              <MenuDropdown
                align="left"
                items={menus[0].items}
                onChoose={(item) => choose(item, 'apple')}
                wide
              />
            )}
          </AnimatePresence>
        </div>

        {menus.slice(1).map((menu) => (
          <div key={menu.id} className="relative flex items-stretch">
            <button
              className={`my-[3px] flex items-center rounded-[4px] px-[9px] text-[13px] leading-none tracking-[-0.1px] transition-colors duration-100 ${
                menu.bold ? 'font-semibold' : 'font-normal'
              } ${openMenu === menu.id ? 'bg-white/20' : 'hover:bg-white/10'} ${
                menu.id === 'app' ? 'hidden min-[420px]:flex' : ''
              } ${['file', 'edit'].includes(menu.id) ? 'hidden sm:flex' : ''} ${
                ['image', 'window', 'help'].includes(menu.id) ? 'hidden md:flex' : ''
              }`}
              onPointerDown={(e) => {
                e.stopPropagation()
                setOpenMenu((v) => (v === menu.id ? null : menu.id))
              }}
              onPointerEnter={() => openMenu && setOpenMenu(menu.id)}
            >
              {menu.label}
            </button>
            <AnimatePresence>
              {openMenu === menu.id && (
                <MenuDropdown
                  align="left"
                  items={menu.items}
                  onChoose={(item) => choose(item, menu.id)}
                  wide={menu.id === 'apple'}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex flex-1 items-stretch justify-end pr-[7px]">
        <div className="flex items-stretch">
          <StatusButton
            label="Mission Control"
            onClick={onToggleMissionControl}
            className="hidden min-[380px]:flex"
          >
            <svg viewBox="0 0 20 20" className="h-[15px] w-[15px]" aria-hidden>
              <rect x="2" y="2" width="6.5" height="6.5" rx="1.4" fill="currentColor" opacity="0.9" />
              <rect x="11.5" y="2" width="6.5" height="6.5" rx="1.4" fill="currentColor" opacity="0.9" />
              <rect x="2" y="11.5" width="6.5" height="6.5" rx="1.4" fill="currentColor" opacity="0.9" />
              <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1.4" fill="currentColor" opacity="0.9" />
            </svg>
          </StatusButton>
          <StatusButton label="Wi-Fi" onClick={onOpenControlCenter} trigger className="hidden sm:flex">
            {wifiOn ? (
              <Wifi className="h-[16px] w-[16px]" strokeWidth={2.1} />
            ) : (
              <WifiOff className="h-[16px] w-[16px]" strokeWidth={2.1} />
            )}
          </StatusButton>
          <StatusButton label="Spotlight Search" onClick={() => onCommand('search')} className="hidden sm:flex">
            <Search className="h-[15px] w-[15px]" strokeWidth={2.2} />
          </StatusButton>
          <StatusButton
            label="Control Center"
            onClick={onOpenControlCenter}
            active={controlCenterOpen}
            trigger
          >
            <ControlCenterGlyph className="h-[16px] w-[16px]" />
          </StatusButton>
          <StatusButton label="Battery">
            <BatteryGlyph percent={100} />
          </StatusButton>
        </div>
        <button className="ml-[7px] flex items-center gap-[7px] rounded-[4px] px-[6px] text-[13px] font-normal leading-none tracking-[-0.05px] hover:bg-white/10">
          <span className="tabular hidden whitespace-nowrap sm:inline">{dateLabel}</span>
          <span className="tabular whitespace-nowrap">{timeLabel}</span>
        </button>
      </div>
    </div>
  )
}

function StatusButton({
  children,
  label,
  onClick,
  active,
  trigger,
  className = '',
}: {
  children: ReactNode
  label: string
  onClick?: () => void
  active?: boolean
  trigger?: boolean
  className?: string
}) {
  return (
    <button
      aria-label={label}
      data-cc-trigger={trigger ? '' : undefined}
      onClick={onClick}
      className={`my-[2px] flex items-center rounded-[4px] px-[6px] transition-colors duration-100 ${
        active ? 'bg-white/20' : 'hover:bg-white/10'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function MenuDropdown({
  items,
  onChoose,
  wide,
}: {
  align?: string
  items: MenuItemDef[]
  onChoose: (item: MenuItemDef) => void
  wide?: boolean
}) {
  return (
    <motion.div
      data-menu-dropdown
      initial={{ opacity: 0, scale: 0.97, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -2 }}
      transition={{ duration: 0.13, ease: [0.32, 0.72, 0, 1] }}
      style={{
        transformOrigin: 'top left',
        background: 'rgba(246,246,248,0.82)',
        backdropFilter: 'blur(48px) saturate(190%)',
        WebkitBackdropFilter: 'blur(48px) saturate(190%)',
      }}
      className={`absolute top-[25px] z-[9100] rounded-[7px] border border-white/50 p-[4px] text-[#1d1d1f] shadow-[0_10px_34px_rgba(0,0,0,0.28),0_1px_3px_rgba(0,0,0,0.18)] ${
        wide ? 'w-[238px]' : 'w-[224px]'
      }`}
    >
      {items.map((item, i) =>
        item.type === 'separator' ? (
          <div key={i} className="mx-[9px] my-[4px] h-px bg-black/[0.12]" />
        ) : (
          <button
            key={i}
            disabled={item.disabled}
            onClick={() => onChoose(item)}
            className={`group flex h-[22px] w-full items-center rounded-[4px] px-[9px] text-left text-[13px] tracking-[-0.08px] ${
              item.disabled
                ? 'text-black/30'
                : 'text-[#1d1d1f] hover:bg-[#0a84ff] hover:text-white'
            }`}
          >
            <span className="w-[15px] shrink-0">
              {item.checked && <Check className="h-[12px] w-[12px]" strokeWidth={3} />}
            </span>
            <span className="flex-1 truncate">{item.label}</span>
            {item.submenu && <ChevronRight className="ml-3 h-[12px] w-[12px] opacity-60" strokeWidth={2.4} />}
            {item.shortcut && (
              <span
                className={`ml-4 text-[12.5px] tracking-[0.2px] ${
                  item.disabled ? 'text-black/25' : 'text-black/45 group-hover:text-white/80'
                }`}
              >
                {item.shortcut}
              </span>
            )}
          </button>
        ),
      )}
    </motion.div>
  )
}
