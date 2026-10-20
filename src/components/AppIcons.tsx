import { useId, type ReactNode, type ReactElement } from 'react'

export interface IconProps {
  className?: string
}

const BASE = 'no-drag select-none'

function Frame({
  from,
  to,
  angle = 90,
  children,
  className,
  gloss = true,
}: {
  from: string
  to: string
  angle?: number
  children: ReactNode
  className?: string
  gloss?: boolean
}) {
  const uid = useId().replace(/[:]/g, '')
  const bg = `bg-${uid}`
  const glossId = `gloss-${uid}`
  const clip = `clip-${uid}`
  const rad = angle * (Math.PI / 180)
  const x2 = 0.5 + Math.cos(rad) * 0.5
  const y2 = 0.5 + Math.sin(rad) * 0.5

  return (
    <svg
      viewBox="0 0 64 64"
      className={`${BASE} ${className ?? ''}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={bg} x1={1 - x2} y1={1 - y2} x2={x2} y2={y2}>
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.14" />
        </linearGradient>
        <clipPath id={clip}>
          <rect width="64" height="64" rx="14.2" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="64" height="64" fill={`url(#${bg})`} />
        {children}
        {gloss && <rect width="64" height="64" fill={`url(#${glossId})`} />}
      </g>
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="13.9"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.22"
        strokeWidth="1"
      />
    </svg>
  )
}

export function FinderIcon({ className }: IconProps) {
  return (
    <Frame from="#d7f1ff" to="#a9dcf7" angle={125} className={className}>
      <path
        d="M32 0H50C57.7 0 64 6.3 64 14V50C64 57.7 57.7 64 50 64H32C38 50 38 14 32 0Z"
        fill="#3184e8"
      />
      <path
        d="M33 0H50C57.7 0 64 6.3 64 14V50C64 57.7 57.7 64 50 64H33C39.5 50 39.5 14 33 0Z"
        fill="url(#finder-r)"
      />
      <defs>
        <linearGradient id="finder-r" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#61b4f5" />
          <stop offset="55%" stopColor="#2b7de4" />
          <stop offset="100%" stopColor="#1a5dbb" />
        </linearGradient>
      </defs>
      <path
        d="M13 27.5C17 27.5 20 25 20 21.5"
        fill="none"
        stroke="#0f3f70"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M26.5 21.5C26.5 25 29.5 27.5 33.5 27.5"
        fill="none"
        stroke="#0f3f70"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M16 38C20.5 45 28 46.5 32.5 38"
        fill="none"
        stroke="#0f3f70"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M3 8C10 3 22 3 32 6"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Frame>
  )
}

export function LaunchpadIcon({ className }: IconProps) {
  const items = [
    { x: 12, y: 12, c: '#3fa9f5' },
    { x: 26.5, y: 12, c: '#ff7a59' },
    { x: 41, y: 12, c: '#ffd23f' },
    { x: 12, y: 26.5, c: '#a06bff' },
    { x: 26.5, y: 26.5, c: '#3ed37b' },
    { x: 41, y: 26.5, c: '#ff5f8f' },
    { x: 12, y: 41, c: '#3ed3c4' },
    { x: 26.5, y: 41, c: '#ff9f43' },
    { x: 41, y: 41, c: '#4b7bff' },
  ]
  return (
    <Frame from="#f7f8fa" to="#d3d7de" angle={130} className={className}>
      {items.map((it, i) => (
        <rect
          key={i}
          x={it.x}
          y={it.y}
          width="11"
          height="11"
          rx="3.1"
          fill={it.c}
          stroke="#ffffff"
          strokeOpacity="0.18"
        />
      ))}
    </Frame>
  )
}

export function SafariIcon({ className }: IconProps) {
  return (
    <Frame from="#55c3ff" to="#1369d8" angle={135} className={className}>
      <circle cx="32" cy="32" r="22.5" fill="#f6fbff" />
      <circle cx="32" cy="32" r="20.5" fill="#dbeefb" />
      <circle cx="32" cy="32" r="19" fill="#2f9fe8" />
      <circle cx="32" cy="32" r="19" fill="url(#safari-inner)" />
      <defs>
        <radialGradient id="safari-inner" cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#6fd2ff" />
          <stop offset="70%" stopColor="#2387e0" />
          <stop offset="100%" stopColor="#1265c4" />
        </radialGradient>
      </defs>
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="32"
          y1="13.6"
          x2="32"
          y2={i % 3 === 0 ? 17.2 : 15.6}
          stroke="#ffffff"
          strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
          strokeOpacity="0.85"
          transform={`rotate(${i * 15} 32 32)`}
        />
      ))}
      <path d="M32 32 L45.2 18.8 L34.6 34.6 Z" fill="#ff4d57" />
      <path d="M32 32 L18.8 45.2 L29.4 29.4 Z" fill="#ffffff" />
      <circle cx="32" cy="32" r="2" fill="#ffffff" />
      <circle cx="32" cy="32" r="1.2" fill="#2a6db3" />
    </Frame>
  )
}

export function MessagesIcon({ className }: IconProps) {
  return (
    <Frame from="#6eea79" to="#1eb84a" angle={150} className={className}>
      <path
        d="M13 18.5C13 13.8 16.8 10 21.5 10H42.5C47.2 10 51 13.8 51 18.5V34.5C51 39.2 47.2 43 42.5 43H28.2L17.6 51.8C16.4 52.8 14.6 51.9 14.7 50.3L15.4 42.1C13.9 40.4 13 38.1 13 35.5V18.5Z"
        fill="#ffffff"
      />
      <path
        d="M32 10C23 10 16.8 14.5 14 21"
        stroke="#ffffff"
        strokeOpacity="0.32"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="24" cy="27" rx="2" ry="2.4" fill="#3ccb63" opacity="0.85" />
      <ellipse cx="32" cy="27" rx="2" ry="2.4" fill="#3ccb63" opacity="0.85" />
      <ellipse cx="40" cy="27" rx="2" ry="2.4" fill="#3ccb63" opacity="0.85" />
    </Frame>
  )
}

export function MailIcon({ className }: IconProps) {
  return (
    <Frame from="#58c2ff" to="#1266d6" angle={140} className={className}>
      <rect x="9" y="15" width="46" height="34" rx="4.5" fill="#ffffff" />
      <path d="M9.8 18.4L32 35L54.2 18.4" fill="none" stroke="#b9d6ee" strokeWidth="1.6" />
      <path d="M9 45.6L25.4 30.6L9 22.6V45.6Z" fill="#eaf4fd" />
      <path d="M55 45.6L38.6 30.6L55 22.6V45.6Z" fill="#dcecf9" />
      <path d="M9.5 17.4C10.4 16 12 15 14 15H50C52 15 53.6 16 54.5 17.4L32 34.4L9.5 17.4Z" fill="#f7fbff" />
      <path d="M9.4 47.2L26.8 30L32 33.8L37.2 30L54.6 47.2C53.6 48.2 52.2 49 50 49H14C11.8 49 10.4 48.2 9.4 47.2Z" fill="#f2f8fe" />
      <path d="M9 22V18C9 16.8 9.4 15.7 10 14.8L26 27.6L9 38.4V22Z" fill="#ffffff" opacity="0.55" />
    </Frame>
  )
}

export function MapsIcon({ className }: IconProps) {
  return (
    <Frame from="#9be6a1" to="#5cbf6e" angle={110} className={className}>
      <path d="M-2 52C16 42 28 52 46 44C54 40 60 38 66 39V66H-2V52Z" fill="#f6eed6" />
      <path d="M-2 30C14 26 20 36 34 32C48 28 56 18 66 16V66H-2V30Z" fill="#c8e3b0" opacity="0.85" />
      <path
        d="M-2 47C14 43 26 48 37 40C50 31 56 25 66 24"
        fill="none"
        stroke="#74c3e8"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M8 0L22 64" stroke="#ffffff" strokeWidth="4.5" strokeOpacity="0.95" />
      <path d="M-2 35L66 12" stroke="#ffffff" strokeWidth="2.6" strokeOpacity="0.7" />
      <path d="M12 0L40 64" stroke="#ffffff" strokeWidth="1.4" strokeOpacity="0.5" />
      <path
        d="M41 16C35.5 16 31 20.5 31 26C31 33.6 41 44 41 44C41 44 51 33.6 51 26C51 20.5 46.5 16 41 16Z"
        fill="#f4524d"
      />
      <circle cx="41" cy="26" r="4.6" fill="#ffffff" />
      <path d="M8 0L22 64" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.25" />
    </Frame>
  )
}

const PHOTO_COLORS = [
  '#ffd23f',
  '#ff9f43',
  '#ff5f57',
  '#ff4b8b',
  '#b06bff',
  '#4b8bff',
  '#2fd3c9',
  '#43d17a',
]

export function PhotosIcon({ className }: IconProps) {
  return (
    <Frame from="#ffffff" to="#eef0f3" angle={130} className={className} gloss={false}>
      <g transform="translate(32 32)">
        {PHOTO_COLORS.map((c, i) => (
          <ellipse
            key={c}
            cx="0"
            cy="-12.5"
            rx="7"
            ry="12.5"
            fill={c}
            opacity="0.82"
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle r="2.6" fill="#ffffff" opacity="0.95" />
      </g>
    </Frame>
  )
}

export function FaceTimeIcon({ className }: IconProps) {
  return (
    <Frame from="#6fe877" to="#0fb14c" angle={145} className={className}>
      <rect x="9" y="19.5" width="31" height="25" rx="6.5" fill="#ffffff" />
      <path d="M43 29L54 22.5V41.5L43 35V29Z" fill="#ffffff" />
      <rect x="14.5" y="24.5" width="20" height="15" rx="3" fill="#0fb14c" opacity="0.2" />
      <circle cx="24.5" cy="32" r="3.6" fill="#34cf68" opacity="0.9" />
    </Frame>
  )
}

export function CameraIcon({ className }: IconProps) {
  const uid = useId().replace(/[:]/g, '')
  const lens = `camera-lens-${uid}`
  return (
    <Frame from="#7b8491" to="#23262d" angle={135} className={className}>
      <rect x="10" y="20" width="44" height="28" rx="7" fill="#f4f5f7" />
      <path
        d="M23.5 20l2.6-5.2c.3-.6.9-1 1.6-1h8.6c.7 0 1.3.4 1.6 1L40.5 20H23.5Z"
        fill="#f4f5f7"
      />
      <circle cx="32" cy="34" r="9.4" fill="#15181d" />
      <circle cx="32" cy="34" r="6.5" fill={`url(#${lens})`} />
      <circle cx="32" cy="34" r="2.7" fill="#0a1a33" />
      <circle cx="29.4" cy="31.4" r="1.5" fill="#ffffff" fillOpacity="0.8" />
      <circle cx="46" cy="25.5" r="2" fill="#ff5f57" />
      <rect x="14" y="24" width="7" height="3" rx="1.5" fill="#c9ced6" />
      <defs>
        <linearGradient id={lens} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7cc4ff" />
          <stop offset="55%" stopColor="#2f7fd4" />
          <stop offset="100%" stopColor="#173f77" />
        </linearGradient>
      </defs>
    </Frame>
  )
}

export function PhotoBoothIcon({ className }: IconProps) {
  return (
    <Frame from="#ff7f7f" to="#b3122e" angle={140} className={className}>
      <path d="M8 12c3.2 2.4 5.4 5.8 5.4 10.4V50c0 1.4-.2 2.6-.7 3.8H8V12z" fill="#6f0617" fillOpacity="0.18" />
      <path d="M56 12c-3.2 2.4-5.4 5.8-5.4 10.4V50c0 1.4.2 2.6.7 3.8H56V12z" fill="#6f0617" fillOpacity="0.18" />
      <rect x="10" y="22" width="44" height="27" rx="6.5" fill="#fff7f7" />
      <path
        d="M22.5 22l2.4-5.2c.3-.7 1-1.2 1.8-1.2h10.6c.8 0 1.5.5 1.8 1.2l2.4 5.2H22.5Z"
        fill="#fff7f7"
      />
      <circle cx="32" cy="35" r="9.2" fill="#2a0a0d" />
      <circle cx="32" cy="35" r="6.4" fill="#ff5964" />
      <circle cx="32" cy="35" r="3" fill="#2a0a0d" />
      <circle cx="29.4" cy="32.4" r="1.5" fill="#ffffff" fillOpacity="0.85" />
      <circle cx="46.5" cy="27" r="1.8" fill="#ffd9dc" />
      <rect x="13.5" y="26" width="5.5" height="2.4" rx="1.2" fill="#ffd9dc" />
    </Frame>
  )
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function CalendarIcon({ className, date = new Date() }: IconProps & { date?: Date }) {
  return (
    <Frame from="#ffffff" to="#f0f1f4" angle={130} className={className} gloss={false}>
      <text
        x="32"
        y="19"
        textAnchor="middle"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="8"
        fontWeight="700"
        letterSpacing="0.6"
        fill="#ff3b30"
      >
        {WEEKDAYS[date.getDay()]}
      </text>
      <text
        x="32"
        y="50"
        textAnchor="middle"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="300"
        letterSpacing="-1.5"
        fill="#1c1c1e"
      >
        {date.getDate()}
      </text>
      <text
        x="32"
        y="59"
        textAnchor="middle"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="5.5"
        fontWeight="600"
        letterSpacing="1.4"
        fill="#8e8e93"
      >
        {MONTHS[date.getMonth()]}
      </text>
    </Frame>
  )
}

export function ContactsIcon({ className }: IconProps) {
  return (
    <Frame from="#ffffff" to="#e7e9ee" angle={130} className={className} gloss={false}>
      <circle cx="32" cy="32" r="20" fill="#dfe3e8" />
      <circle cx="32" cy="26.5" r="7.2" fill="#9aa2ad" />
      <path d="M18.5 48C18.5 40.8 24.5 36.5 32 36.5C39.5 36.5 45.5 40.8 45.5 48H18.5Z" fill="#9aa2ad" />
      <rect x="9" y="26" width="6" height="12" rx="2" fill="#ff5f57" />
      <rect x="9" y="30" width="5" height="2" rx="1" fill="#ffffff" opacity="0.6" />
    </Frame>
  )
}

export function RemindersIcon({ className }: IconProps) {
  const rows = [
    { y: 17, color: '#ff5f57' },
    { y: 27, color: '#ffb340' },
    { y: 37, color: '#4aa8ff' },
    { y: 47, color: '#3ed37b' },
  ]
  return (
    <Frame from="#ffffff" to="#eef0f3" angle={130} className={className} gloss={false}>
      {rows.map((r) => (
        <g key={r.y}>
          <circle cx="14" cy={r.y} r="3.6" fill={r.color} />
          <circle cx="14" cy={r.y} r="1.5" fill="#ffffff" opacity="0.8" />
          <rect x="22" y={r.y - 1.4} width="30" height="2.8" rx="1.4" fill="#d7d9dd" />
        </g>
      ))}
    </Frame>
  )
}

export function NotesIcon({ className }: IconProps) {
  return (
    <Frame from="#ffffff" to="#f1f1f3" angle={130} className={className} gloss={false}>
      <path d="M0 0H64V16H0Z" fill="#f8d64b" />
      <path d="M0 12.5H64V16H0Z" fill="#e8bd2a" opacity="0.6" />
      <rect x="11" y="26" width="42" height="2.6" rx="1.3" fill="#cfd2d7" />
      <rect x="11" y="34" width="38" height="2.6" rx="1.3" fill="#d8dade" />
      <rect x="11" y="42" width="41" height="2.6" rx="1.3" fill="#d8dade" />
      <rect x="11" y="50" width="24" height="2.6" rx="1.3" fill="#dfe1e5" />
      <circle cx="9" cy="8" r="1.3" fill="#c79e16" opacity="0.7" />
      <circle cx="14" cy="8" r="1.3" fill="#c79e16" opacity="0.7" />
      <circle cx="19" cy="8" r="1.3" fill="#c79e16" opacity="0.7" />
    </Frame>
  )
}

export function TVIcon({ className }: IconProps) {
  return (
    <Frame from="#3a3a3f" to="#08080a" angle={135} className={className}>
      <text
        x="32"
        y="41"
        textAnchor="middle"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="26"
        fontWeight="600"
        letterSpacing="-1.2"
        fill="#ffffff"
      >
        tv
      </text>
      <ellipse cx="32" cy="17" rx="22" ry="7" fill="#ffffff" opacity="0.06" />
    </Frame>
  )
}

export function MusicIcon({ className }: IconProps) {
  return (
    <Frame from="#fc6e7d" to="#de2f47" angle={150} className={className}>
      <path d="M25.5 19.5L45 15V33.5H39.5V21.3L31 23.4V43.5H25.5V19.5Z" fill="#ffffff" />
      <ellipse cx="20.5" cy="45.5" rx="7.2" ry="5.6" transform="rotate(-18 20.5 45.5)" fill="#ffffff" />
      <ellipse cx="39" cy="41.5" rx="7.2" ry="5.6" transform="rotate(-18 39 41.5)" fill="#ffffff" />
      <path d="M25.5 19.5L45 15V20L25.5 24.5V19.5Z" fill="#ffffff" opacity="0.85" />
    </Frame>
  )
}

export function PodcastsIcon({ className }: IconProps) {
  return (
    <Frame from="#c07bf6" to="#7633d6" angle={150} className={className}>
      <circle cx="32" cy="32" r="22" fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2.4" />
      <circle cx="32" cy="32" r="15.5" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2.4" />
      <circle cx="32" cy="32" r="9" fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.4" />
      <circle cx="32" cy="32" r="4.6" fill="#ffffff" />
      <circle cx="32" cy="32" r="2.2" fill="#8b45e0" />
    </Frame>
  )
}

export function NewsIcon({ className }: IconProps) {
  return (
    <Frame from="#ffffff" to="#f0f1f4" angle={130} className={className} gloss={false}>
      <path
        d="M15 48V17C15 15.3 16.3 14 18 14H36.5L49 26.5V48C49 49.7 47.7 51 46 51H18C16.3 51 15 49.7 15 48Z"
        fill="#fb4b5b"
      />
      <path d="M36.5 14L49 26.5H38.5C37.4 26.5 36.5 25.6 36.5 24.5V14Z" fill="#ff8a95" />
      <path d="M22 23H31M22 30H43M22 37H43M22 44H36" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
    </Frame>
  )
}

export function NumbersIcon({ className }: IconProps) {
  return (
    <Frame from="#7bdf83" to="#1da33f" angle={140} className={className}>
      <rect x="11" y="11" width="42" height="42" rx="5" fill="#ffffff" opacity="0.16" />
      <rect x="17" y="31" width="7.5" height="15" rx="1.6" fill="#ffffff" />
      <rect x="28.2" y="24" width="7.5" height="22" rx="1.6" fill="#ffffff" opacity="0.92" />
      <rect x="39.4" y="17" width="7.5" height="29" rx="1.6" fill="#ffffff" />
    </Frame>
  )
}

export function PagesIcon({ className }: IconProps) {
  return (
    <Frame from="#ffc85c" to="#f0801c" angle={145} className={className}>
      <path d="M17 10H37.5L48 20.5V54H17V10Z" fill="#ffffff" />
      <path d="M37.5 10L48 20.5H39.5C38.4 20.5 37.5 19.6 37.5 18.5V10Z" fill="#ffdba4" />
      <path d="M23 28H42M23 34H42M23 40H36" stroke="#d8d8dc" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M23 47H31" stroke="#d8d8dc" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M44 43L51.5 35.5" stroke="#f0801c" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </Frame>
  )
}

export function AppStoreIcon({ className }: IconProps) {
  return (
    <Frame from="#4fc9f7" to="#1668e0" angle={145} className={className}>
      <path d="M18 48L30 22" stroke="#ffffff" strokeWidth="5.4" strokeLinecap="round" />
      <path d="M46 48L34 22" stroke="#ffffff" strokeWidth="5.4" strokeLinecap="round" />
      <path d="M25 38H39" stroke="#ffffff" strokeWidth="5.4" strokeLinecap="round" />
      <circle cx="32" cy="48" r="2.6" fill="#ffffff" />
      <path d="M13 16C20 9 30 7 38 9" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </Frame>
  )
}

function gearPath(cx: number, cy: number, rOuter: number, rInner: number, teeth: number) {
  const pts: string[] = []
  const total = teeth * 2
  for (let i = 0; i < total; i++) {
    const r = i % 2 === 0 ? rOuter : rInner
    const a = (i / total) * Math.PI * 2 - Math.PI / 2
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`)
  }
  return `M${pts.join('L')}Z`
}

export function SystemPreferencesIcon({ className }: IconProps) {
  return (
    <Frame from="#b7bcc4" to="#565b64" angle={135} className={className}>
      <path
        d={gearPath(32, 32, 22, 17.2, 9)}
        fill="#eef1f4"
        stroke="#eef1f4"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="10.6" fill="#9aa1ab" />
      <circle cx="32" cy="32" r="10.6" fill="url(#prefs-inner)" />
      <defs>
        <linearGradient id="prefs-inner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c3c8cf" />
          <stop offset="100%" stopColor="#6d737c" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="4.4" fill="#e9edf1" opacity="0.55" />
      <path d="M17 17C24 11 34 10 41 12" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </Frame>
  )
}

export function DownloadsIcon({ className }: IconProps) {
  return (
    <Frame from="#66c3fb" to="#1478e6" angle={140} className={className}>
      <path d="M8 19C8 16.8 9.8 15 12 15H25L29.5 20H52C54.2 20 56 21.8 56 24V48C56 50.2 54.2 52 52 52H12C9.8 52 8 50.2 8 48V19Z" fill="#2b8ff0" />
      <path d="M8 26H56V48C56 50.2 54.2 52 52 52H12C9.8 52 8 50.2 8 48V26Z" fill="url(#dl-front)" />
      <defs>
        <linearGradient id="dl-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ed2ff" />
          <stop offset="100%" stopColor="#3a9bf2" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="38" r="12" fill="#ffffff" opacity="0.95" />
      <path d="M32 31V43M32 43L27 38M32 43L37 38" stroke="#2f8fe8" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  )
}

export function TrashIcon({ className }: IconProps) {
  return (
    <Frame from="#f3f5f8" to="#c3c8d0" angle={120} className={className}>
      <path d="M18 17H46L43.2 56H20.8L18 17Z" fill="url(#trash-body)" />
      <defs>
        <linearGradient id="trash-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#aab0b9" />
          <stop offset="26%" stopColor="#eef1f5" />
          <stop offset="50%" stopColor="#c8cdd5" />
          <stop offset="74%" stopColor="#eef1f5" />
          <stop offset="100%" stopColor="#9ca3ad" />
        </linearGradient>
      </defs>
      <path d="M22.5 20L24.5 52M32 20V52M41.5 20L39.5 52" stroke="#7f8792" strokeOpacity="0.45" strokeWidth="1.2" />
      <rect x="15" y="13.5" width="34" height="5" rx="2.4" fill="#e8ebef" />
      <rect x="15" y="13.5" width="34" height="5" rx="2.4" fill="url(#trash-lid)" />
      <path d="M26 13.5C26 10.5 28.5 8 32 8C35.5 8 38 10.5 38 13.5" fill="none" stroke="#c9ced6" strokeWidth="2.4" />
      <ellipse cx="32" cy="16" rx="10" ry="1.5" fill="#ffffff" opacity="0.45" />
      <defs>
        <linearGradient id="trash-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8d949e" stopOpacity="0.35" />
        </linearGradient>
      </defs>
    </Frame>
  )
}

export function FolderIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={`${BASE} ${className ?? ''}`} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="folder-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5fb8f5" />
          <stop offset="100%" stopColor="#2f8be8" />
        </linearGradient>
        <linearGradient id="folder-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a7dcff" />
          <stop offset="100%" stopColor="#58b1f2" />
        </linearGradient>
      </defs>
      <path d="M4 14C4 11 6 9 9 9H24L29 15H55C58 15 60 17 60 20V50C60 53 58 55 55 55H9C6 55 4 53 4 50V14Z" fill="url(#folder-back)" />
      <path d="M4 23C4 20 6 18 9 18H55C58 18 60 20 60 23V50C60 53 58 55 55 55H9C6 55 4 53 4 50V23Z" fill="url(#folder-front)" />
      <path d="M4 25C4 22.5 6 21 8.5 21H55.5C58 21 60 22.5 60 25" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />
    </svg>
  )
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={`${BASE} ${className ?? ''}`} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M13 7H38L52 21V54C52 55.7 50.7 57 49 57H13C11.3 57 10 55.7 10 54V10C10 8.3 11.3 7 13 7Z" fill="#ffffff" stroke="#d4d8de" />
      <path d="M38 7L52 21H41C39.3 21 38 19.7 38 18V7Z" fill="#e8ebef" stroke="#d4d8de" />
      <path d="M17 29H45M17 35H45M17 41H38" stroke="#c9ced6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function AppleLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="currentColor"
        d="M17.05 12.54c-.02-2.2 1.8-3.27 1.88-3.32-1.02-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.7 0-1.75-.78-2.87-.76-1.47.02-2.83.86-3.59 2.19-1.53 2.65-.39 6.58 1.1 8.73.73 1.05 1.6 2.22 2.74 2.18 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.66-2.12.84-1.21 1.18-2.38 1.2-2.44-.03-.01-2.29-.88-2.31-3.51Zm-1.87-6.4c.6-.74 1.02-1.76.91-2.78-.88.04-1.95.59-2.58 1.32-.56.65-1.05 1.7-.92 2.7.98.08 1.99-.5 2.59-1.24Z"
      />
    </svg>
  )
}

export const APP_ICONS: Record<string, (p: IconProps) => ReactElement> = {
  finder: FinderIcon,
  launchpad: LaunchpadIcon,
  safari: SafariIcon,
  messages: MessagesIcon,
  mail: MailIcon,
  maps: MapsIcon,
  photos: PhotosIcon,
  camera: CameraIcon,
  photobooth: PhotoBoothIcon,
  facetime: FaceTimeIcon,
  calendar: CalendarIcon,
  contacts: ContactsIcon,
  reminders: RemindersIcon,
  notes: NotesIcon,
  tv: TVIcon,
  music: MusicIcon,
  podcasts: PodcastsIcon,
  news: NewsIcon,
  numbers: NumbersIcon,
  pages: PagesIcon,
  appstore: AppStoreIcon,
  settings: SystemPreferencesIcon,
  downloads: DownloadsIcon,
  trash: TrashIcon,
}
