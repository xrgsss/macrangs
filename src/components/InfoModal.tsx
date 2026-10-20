import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { AppleLogo, APP_ICONS } from './AppIcons'

export type InfoModalKind = 'about-mac' | 'about-app' | 'help' | 'info'

interface InfoModalProps {
  kind: InfoModalKind
  appId?: string
  appName?: string
  subject?: string
  folderCount?: number
  wallpaperName?: string
  onClose: () => void
}

const SHORTCUTS = [
  ['⌘ W', 'Close the active window'],
  ['⌘ M', 'Minimize to the Dock'],
  ['⌘ Tab', 'Switch between open apps'],
  ['Ctrl ↑', 'Open Mission Control'],
  ['⌘ Space', 'Open Spotlight Search'],
  ['Esc', 'Dismiss menus and overlays'],
]

export function InfoModal({
  kind,
  appId,
  appName,
  subject,
  folderCount = 0,
  wallpaperName = 'Big Sur',
  onClose,
}: InfoModalProps) {
  const title =
    kind === 'about-mac'
      ? 'About This Mac'
      : kind === 'about-app'
        ? `About ${appName ?? 'Application'}`
        : kind === 'help'
          ? 'macOS Help'
          : subject
            ? `${subject} Info`
            : 'Desktop Info'

  return (
    <motion.div
      data-modal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
      className="fixed inset-0 z-[9700] flex items-center justify-center bg-black/20 p-4 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 4 }}
        transition={{ type: 'spring', stiffness: 390, damping: 32, mass: 0.85 }}
        className="w-full max-w-[510px] overflow-hidden rounded-[13px] border border-white/45 text-[#1d1d1f]"
        style={{
          background: 'rgba(246,246,248,0.86)',
          backdropFilter: 'blur(54px) saturate(190%)',
          WebkitBackdropFilter: 'blur(54px) saturate(190%)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.46), 0 0 0 0.5px rgba(0,0,0,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[40px] shrink-0 items-center justify-between border-b border-black/[0.09] px-[13px]">
          <span className="text-[13px] font-semibold tracking-[-0.12px]">{title}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-[22px] w-[22px] place-items-center rounded-full text-black/45 hover:bg-black/[0.08]"
          >
            <X className="h-[13px] w-[13px]" />
          </button>
        </div>

        <div className="px-[24px] py-[24px]">
          {kind === 'about-mac' && <AboutMac />}
          {kind === 'about-app' && <AboutApp appId={appId} appName={appName} />}
          {kind === 'help' && <Help />}
          {kind === 'info' && (
            <div>
              <div className="flex items-center gap-[14px]">
                <div className="grid h-[56px] w-[56px] place-items-center rounded-[12px] bg-gradient-to-br from-[#4aa8ff] to-[#0a5bd6] shadow-[0_6px_16px_rgba(10,90,214,0.26)]">
                  <AppleLogo className="h-[27px] w-[27px] text-white" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[17px] font-semibold tracking-[-0.3px]">
                    {subject ?? 'Desktop'}
                  </p>
                  <p className="mt-[2px] text-[10.5px] text-black/45">
                    {subject ? 'Folder · 0 items' : 'macOS Big Sur 11.7.10'}
                  </p>
                </div>
              </div>
              <div className="mt-[18px] overflow-hidden rounded-[8px] border border-black/[0.08] bg-white/65">
                {[
                  ['Kind', subject ? 'Folder' : 'Desktop'],
                  ['Wallpaper', wallpaperName],
                  ['Desktop items', `${folderCount} folder${folderCount === 1 ? '' : 's'}`],
                  ['Display', '2560 × 1600 Retina'],
                  ['Available', '128.4 GB of 512 GB'],
                ].map(([label, value], i, arr) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between px-[12px] py-[7px] text-[11px] ${
                      i < arr.length - 1 ? 'border-b border-black/[0.06]' : ''
                    }`}
                  >
                    <span className="text-black/40">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-[14px] text-[9.5px] leading-[14px] text-black/35">
                Desktop folders are stored in this simulation only. Double-click a folder to open it in Finder.
              </p>
            </div>
          )}
        </div>

        <div className="flex h-[46px] shrink-0 items-center justify-end border-t border-black/[0.08] px-[14px]">
          <button
            onClick={onClose}
            className="rounded-[6px] bg-[#0a84ff] px-[16px] py-[4px] text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95"
          >
            OK
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function AboutMac() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex h-[92px] w-[150px] items-center justify-center rounded-[10px] bg-gradient-to-br from-[#2c2c31] to-[#0b0b0e] shadow-[0_14px_34px_rgba(0,0,0,0.32)]">
        <div className="relative h-[58px] w-[118px] overflow-hidden rounded-[4px] border border-white/15 bg-gradient-to-br from-[#ff9a6b] via-[#a24a8f] to-[#243a6b]">
          <div className="absolute -right-4 -top-5 h-[44px] w-[44px] rounded-full bg-[#ffd08a]/50 blur-[14px]" />
          <div className="absolute bottom-0 left-0 right-0 h-[20px] bg-[#101a35]/75" />
          <div className="absolute bottom-[6px] left-[8px] h-[2px] w-[30px] rounded bg-white/25" />
        </div>
        <div className="absolute -bottom-[2px] h-[4px] w-[132px] rounded-b-[5px] bg-[#3d3d42]" />
      </div>
      <h2 className="mt-[18px] text-[24px] font-semibold tracking-[-0.6px]">MacBook Pro</h2>
      <p className="mt-[1px] text-[11px] text-black/40">13-inch, M1, 2020</p>
      <div className="mt-[18px] w-full space-y-[5px] rounded-[8px] border border-black/[0.07] bg-white/60 px-[14px] py-[12px] text-left text-[11px] leading-[16px]">
        <div className="flex justify-between"><span className="text-black/40">Chip</span><span className="font-medium">Apple M1</span></div>
        <div className="flex justify-between"><span className="text-black/40">Memory</span><span className="font-medium">16 GB</span></div>
        <div className="flex justify-between"><span className="text-black/40">Storage</span><span className="font-medium">512 GB SSD</span></div>
        <div className="flex justify-between"><span className="text-black/40">macOS</span><span className="font-medium">Big Sur 11.7.10</span></div>
        <div className="flex justify-between"><span className="text-black/40">Serial Number</span><span className="font-medium">C02BIGSUR2020</span></div>
      </div>
      <p className="mt-[14px] text-[9px] text-black/30">™ and © Apple Inc. 1983–2026. All Rights Reserved.</p>
    </div>
  )
}

function AboutApp({ appId, appName }: { appId?: string; appName?: string }) {
  const Glyph = appId ? APP_ICONS[appId] : null
  return (
    <div className="flex flex-col items-center text-center">
      <div className="grid h-[100px] w-[100px] place-items-center">
        {Glyph ? <Glyph className="h-[88px] w-[88px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.24)]" /> : <AppleLogo className="h-[70px] w-[70px]" />}
      </div>
      <h2 className="mt-[12px] text-[24px] font-semibold tracking-[-0.6px]">{appName ?? 'Application'}</h2>
      <p className="mt-[2px] text-[11px] text-black/40">Version 11.0 (Build 2026.10)</p>
      <div className="mt-[16px] w-full rounded-[8px] border border-black/[0.07] bg-white/60 px-[14px] py-[10px] text-[10.5px] leading-[16px] text-black/50">
        A faithful recreation of {appName ?? 'this app'} for the web — built with React, TypeScript,
        Tailwind CSS and Framer Motion.
      </div>
      <p className="mt-[14px] text-[9px] text-black/30">© 2026 Studio Fold. All Rights Reserved.</p>
    </div>
  )
}

function Help() {
  return (
    <div>
      <div className="flex items-center gap-[10px]">
        <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#0a84ff]/10">
          <AppleLogo className="h-[20px] w-[20px] text-[#0a84ff]" />
        </div>
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.2px]">macOS Help</p>
          <p className="text-[10px] text-black/40">Big Sur · Keyboard shortcuts</p>
        </div>
      </div>
      <div className="mt-[14px] overflow-hidden rounded-[8px] border border-black/[0.08] bg-white/65">
        {SHORTCUTS.map(([keys, description], i) => (
          <div
            key={keys}
            className={`flex items-center justify-between gap-[12px] px-[12px] py-[7px] text-[11px] ${
              i < SHORTCUTS.length - 1 ? 'border-b border-black/[0.06]' : ''
            }`}
          >
            <span className="text-black/55">{description}</span>
            <span className="shrink-0 rounded-[4px] border border-black/[0.12] bg-white px-[6px] py-[1px] text-[10px] font-medium text-black/60 shadow-sm">
              {keys}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-[13px] text-[9.5px] leading-[14px] text-black/35">
        Tip: Right-click anywhere on the desktop to create folders or change the wallpaper. Click the
        Control Center icon in the menu bar to adjust display and sound.
      </p>
    </div>
  )
}
