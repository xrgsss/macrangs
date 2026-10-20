import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Airplay,
  Bluetooth,
  ChevronRight,
  Moon,
  Pause,
  Play,
  SkipForward,
  Speaker,
  Sun,
  SunMedium,
  Wifi,
  WifiOff,
} from 'lucide-react'

export const TRACKS = [
  {
    title: 'Something About You',
    artist: 'Hayden James',
    album: 'Between Us',
    art: 0,
    duration: 213,
  },
  {
    title: 'Tadow',
    artist: 'Masego & FKJ',
    album: 'Lady Lady',
    art: 1,
    duration: 301,
  },
  {
    title: 'Intro',
    artist: 'The xx',
    album: 'xx',
    art: 2,
    duration: 128,
  },
]

export function AlbumArt({ variant = 0, className }: { variant?: number; className?: string }) {
  const palettes = [
    { a: '#ffb36b', b: '#ff5f6d', c: '#4b2c6b' },
    { a: '#8b6bff', b: '#ff5fa2', c: '#251a54' },
    { a: '#5fd0e8', b: '#2b6cb0', c: '#0a1c33' },
  ]
  const p = palettes[variant % palettes.length]
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={`art-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.a} />
          <stop offset="55%" stopColor={p.b} />
          <stop offset="100%" stopColor={p.c} />
        </linearGradient>
        <linearGradient id={`art-${variant}-w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.c} stopOpacity="0.1" />
          <stop offset="100%" stopColor={p.c} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" fill={`url(#art-${variant})`} />
      <circle cx="43" cy="22" r="8" fill="#ffd8a8" opacity="0.75" />
      <path d="M0 45C12 39 20 42 30 46C42 51 52 48 64 40V64H0V45Z" fill={`url(#art-${variant}-w)`} />
      <path d="M0 53C10 48 22 52 34 55C45 58 55 55 64 50V64H0V53Z" fill={p.c} opacity="0.9" />
      <rect width="64" height="64" fill="#ffffff" opacity="0.03" />
    </svg>
  )
}

interface SliderProps {
  value: number
  onChange: (v: number) => void
  label: string
  leading?: ReactNode
}

function Slider({ value, onChange, label, leading }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    onChange(Math.round(next))
  }

  return (
    <div className="flex items-center gap-[8px]">
      {leading && <div className="flex w-[15px] shrink-0 justify-center text-black/55">{leading}</div>}
      <div
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        tabIndex={0}
        onPointerDown={(e) => {
          e.stopPropagation()
          e.currentTarget.setPointerCapture(e.pointerId)
          setFromClientX(e.clientX)
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) setFromClientX(e.clientX)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault()
            onChange(Math.max(0, value - 5))
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault()
            onChange(Math.min(100, value + 5))
          }
        }}
        className="relative h-[21px] flex-1 cursor-pointer touch-none overflow-hidden rounded-full bg-black/[0.16] outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-white/80"
        style={{ boxShadow: 'inset 0 0.5px 1px rgba(0,0,0,0.12)' }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white"
          style={{
            width: `${value}%`,
            boxShadow: '0 0.5px 1px rgba(0,0,0,0.14)',
            transition: 'width 60ms linear',
          }}
        />
      </div>
    </div>
  )
}

interface TileProps {
  children: ReactNode
  className?: string
}

function Tile({ children, className }: TileProps) {
  return (
    <div
      className={`rounded-[15px] border border-white/55 bg-white/55 ${className ?? ''}`}
      style={{
        boxShadow: '0 0.5px 1.5px rgba(0,0,0,0.06), inset 0 0.5px 0 rgba(255,255,255,0.6)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {children}
    </div>
  )
}

export interface ControlCenterProps {
  wifiOn: boolean
  bluetoothOn: boolean
  airdropOn: boolean
  focusOn: boolean
  brightness: number
  volume: number
  keyboardBrightness: number
  playing: boolean
  trackIndex: number
  onToggleWifi: () => void
  onToggleBluetooth: () => void
  onToggleAirdrop: () => void
  onToggleFocus: () => void
  onBrightness: (v: number) => void
  onVolume: (v: number) => void
  onKeyboardBrightness: (v: number) => void
  onTogglePlay: () => void
  onNextTrack: () => void
}

export function ControlCenter({
  wifiOn,
  bluetoothOn,
  airdropOn,
  focusOn,
  brightness,
  volume,
  keyboardBrightness,
  playing,
  trackIndex,
  onToggleWifi,
  onToggleBluetooth,
  onToggleAirdrop,
  onToggleFocus,
  onBrightness,
  onVolume,
  onKeyboardBrightness,
  onTogglePlay,
  onNextTrack,
}: ControlCenterProps) {
  const track = TRACKS[trackIndex % TRACKS.length]
  const [progress, setProgress] = useState(18)

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.18))
    }, 1000)
    return () => window.clearInterval(id)
  }, [playing])

  useEffect(() => {
    setProgress(12 + trackIndex * 9)
  }, [trackIndex])

  return (
    <motion.div
      data-control-center
      initial={{ opacity: 0, scale: 0.9, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -6 }}
      transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
      style={{
        transformOrigin: 'top right',
        background: 'rgba(238, 238, 242, 0.66)',
        backdropFilter: 'blur(48px) saturate(190%)',
        WebkitBackdropFilter: 'blur(48px) saturate(190%)',
        boxShadow:
          '0 0 0 0.5px rgba(0,0,0,0.16), 0 18px 48px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.16)',
      }}
      className="fixed right-[9px] top-[31px] z-[8800] w-[332px] max-w-[calc(100vw-18px)] select-none rounded-[21px] border border-white/45 p-[12px] text-[#1d1d1f]"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-2 gap-[10px]">
        <Tile className="flex flex-col justify-center gap-[2px] px-[10px] py-[8px]">
          <button
            onClick={onToggleWifi}
            className="flex h-[34px] items-center gap-[9px] rounded-[9px] px-[2px] text-left transition-colors hover:bg-black/[0.04]"
          >
            <span
              className={`grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full text-white transition-colors duration-200 ${
                wifiOn ? 'bg-[#0a84ff]' : 'bg-[#8e8e93]'
              }`}
            >
              {wifiOn ? <Wifi className="h-[14px] w-[14px]" strokeWidth={2.6} /> : <WifiOff className="h-[14px] w-[14px]" strokeWidth={2.4} />}
            </span>
            <span className="min-w-0 flex-1 leading-none">
              <span className="block text-[12px] font-semibold tracking-[-0.05px]">Wi-Fi</span>
              <span className="mt-[3px] block truncate text-[10.5px] text-black/50">
                {wifiOn ? 'Home Network' : 'Off'}
              </span>
            </span>
            <ChevronRight className="h-[12px] w-[12px] text-black/25" />
          </button>

          <button
            onClick={onToggleBluetooth}
            className="flex h-[34px] items-center gap-[9px] rounded-[9px] px-[2px] text-left transition-colors hover:bg-black/[0.04]"
          >
            <span
              className={`grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full text-white transition-colors duration-200 ${
                bluetoothOn ? 'bg-[#0a84ff]' : 'bg-[#8e8e93]'
              }`}
            >
              <Bluetooth className="h-[14px] w-[14px]" strokeWidth={2.4} />
            </span>
            <span className="min-w-0 flex-1 leading-none">
              <span className="block text-[12px] font-semibold tracking-[-0.05px]">Bluetooth</span>
              <span className="mt-[3px] block truncate text-[10.5px] text-black/50">
                {bluetoothOn ? 'On' : 'Off'}
              </span>
            </span>
            <ChevronRight className="h-[12px] w-[12px] text-black/25" />
          </button>

          <button
            onClick={onToggleAirdrop}
            className="flex h-[34px] items-center gap-[9px] rounded-[9px] px-[2px] text-left transition-colors hover:bg-black/[0.04]"
          >
            <span
              className={`grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full text-white transition-colors duration-200 ${
                airdropOn ? 'bg-[#0a84ff]' : 'bg-[#8e8e93]'
              }`}
            >
              <Airplay className="h-[14px] w-[14px]" strokeWidth={2.4} />
            </span>
            <span className="min-w-0 flex-1 leading-none">
              <span className="block text-[12px] font-semibold tracking-[-0.05px]">AirDrop</span>
              <span className="mt-[3px] block truncate text-[10.5px] text-black/50">
                {airdropOn ? 'Contacts Only' : 'Off'}
              </span>
            </span>
            <ChevronRight className="h-[12px] w-[12px] text-black/25" />
          </button>
        </Tile>

        <div className="flex flex-col gap-[10px]">
          <button
            onClick={onToggleFocus}
            className={`flex flex-1 items-center gap-[9px] rounded-[15px] border px-[10px] text-left transition-colors duration-200 ${
              focusOn
                ? 'border-white/20 bg-[#5d5ce6] text-white'
                : 'border-white/55 bg-white/55'
            }`}
            style={{
              boxShadow: focusOn
                ? '0 3px 10px rgba(64,60,180,0.28), inset 0 0.5px 0 rgba(255,255,255,0.2)'
                : '0 0.5px 1.5px rgba(0,0,0,0.06), inset 0 0.5px 0 rgba(255,255,255,0.6)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <span
              className={`grid h-[25px] w-[25px] shrink-0 place-items-center rounded-full ${
                focusOn ? 'bg-white/[0.22] text-white' : 'bg-[#5d5ce6] text-white'
              }`}
            >
              <Moon className="h-[13px] w-[13px]" fill="currentColor" strokeWidth={1} />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block text-[12px] font-semibold">Focus</span>
              <span className={`mt-[3px] block truncate text-[10.5px] ${focusOn ? 'text-white/70' : 'text-black/50'}`}>
                {focusOn ? 'Do Not Disturb' : 'Off'}
              </span>
            </span>
          </button>

          <Tile className="flex flex-col justify-center gap-[5px] px-[10px] py-[8px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold leading-none">Keyboard Brightness</span>
              <SunMedium className="h-[12px] w-[12px] text-black/45" />
            </div>
            <Slider
              value={keyboardBrightness}
              onChange={onKeyboardBrightness}
              label="Keyboard brightness"
            />
          </Tile>
        </div>
      </div>

      <Tile className="mt-[10px] px-[10px] py-[9px]">
        <div className="mb-[4px] flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-[-0.05px]">Display</span>
          <span className="text-[10.5px] text-black/40">Built-in Retina</span>
        </div>
        <Slider
          value={brightness}
          onChange={onBrightness}
          label="Display brightness"
          leading={<Sun className="h-[14px] w-[14px]" strokeWidth={2.2} />}
        />
      </Tile>

      <Tile className="mt-[10px] px-[10px] py-[9px]">
        <div className="mb-[4px] flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-[-0.05px]">Sound</span>
          <span className="text-[10.5px] text-black/40">MacBook Pro Speakers</span>
        </div>
        <Slider
          value={volume}
          onChange={onVolume}
          label="Volume"
          leading={<Speaker className="h-[14px] w-[14px]" strokeWidth={2.2} />}
        />
      </Tile>

      <Tile className="mt-[10px] px-[10px] py-[9px]">
        <div className="flex items-center gap-[10px]">
          <AlbumArt
            variant={track.art}
            className="h-[46px] w-[46px] shrink-0 rounded-[7px] shadow-[0_2px_6px_rgba(0,0,0,0.22)]"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold leading-[15px] tracking-[-0.1px]">
              {track.title}
            </div>
            <div className="truncate text-[10.5px] leading-[14px] text-black/50">{track.artist}</div>
            <div className="mt-[6px] h-[3px] w-full overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-black/45 transition-[width] duration-700 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-[2px]">
            <button
              onClick={onTogglePlay}
              aria-label={playing ? 'Pause' : 'Play'}
              className="grid h-[27px] w-[27px] place-items-center rounded-full transition-colors hover:bg-black/[0.07] active:scale-95"
            >
              {playing ? (
                <Pause className="h-[15px] w-[15px]" fill="currentColor" strokeWidth={1.4} />
              ) : (
                <Play className="ml-[1px] h-[15px] w-[15px]" fill="currentColor" strokeWidth={1.4} />
              )}
            </button>
            <button
              onClick={onNextTrack}
              aria-label="Next track"
              className="grid h-[27px] w-[27px] place-items-center rounded-full transition-colors hover:bg-black/[0.07] active:scale-95"
            >
              <SkipForward className="h-[14px] w-[14px]" fill="currentColor" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </Tile>
    </motion.div>
  )
}
