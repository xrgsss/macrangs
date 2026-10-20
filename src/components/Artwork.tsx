import { useId } from 'react'

const PALETTES = [
  { sky: ['#2b1a4a', '#a34a8f', '#ff9a6b'], sun: '#ffd9a0', ridge: ['#39204f', '#160d28'], water: '#2a173f', sunX: 118, sunY: 92 },
  { sky: ['#0c2b4a', '#1d6b8f', '#a8d8d0'], sun: '#ffe9b8', ridge: ['#124a5c', '#061f2e'], water: '#0c3a4c', sunX: 288, sunY: 74 },
  { sky: ['#ffcf8f', '#ff8f7a', '#b25a8f'], sun: '#fff3cf', ridge: ['#8a4a6d', '#3a1d3a'], water: '#5b2b4f', sunX: 200, sunY: 128 },
  { sky: ['#101a35', '#334a7a', '#b787a8'], sun: '#ffe7d1', ridge: ['#253055', '#0b1124'], water: '#131c38', sunX: 84, sunY: 66 },
  { sky: ['#123b31', '#3d8a6c', '#d9d29a'], sun: '#fff6c9', ridge: ['#1e5a48', '#082219'], water: '#0f3a2c', sunX: 318, sunY: 96 },
  { sky: ['#2a1238', '#75306f', '#e8877c'], sun: '#ffd8c2', ridge: ['#4a2148', '#180a22'], water: '#30132f', sunX: 206, sunY: 104 },
  { sky: ['#061d2c', '#0f4f5f', '#4fa6a0'], sun: '#d6fff4', ridge: ['#0d3a44', '#03181f'], water: '#082d37', sunX: 122, sunY: 82 },
  { sky: ['#3a1c18', '#a8503a', '#ffbe7d'], sun: '#ffe9ba', ridge: ['#5e2c24', '#1f0d0b'], water: '#3a1a16', sunX: 284, sunY: 116 },
  { sky: ['#171b40', '#4b3a80', '#ef7f8f'], sun: '#ffe3d1', ridge: ['#2a2050', '#0b0920'], water: '#1a1738', sunX: 98, sunY: 100 },
  { sky: ['#0b2735', '#2d6f7a', '#e7c58b'], sun: '#fff0c4', ridge: ['#1b4e52', '#071b22'], water: '#0b3038', sunX: 260, sunY: 88 },
  { sky: ['#241129', '#6d2c53', '#ff9a63'], sun: '#ffd7a1', ridge: ['#432040', '#170a1c'], water: '#2a1330', sunX: 148, sunY: 110 },
  { sky: ['#102238', '#29648c', '#9cc6cf'], sun: '#f2fbff', ridge: ['#1a4258', '#081827'], water: '#0f3145', sunX: 324, sunY: 70 },
]

export function PhotoArt({
  variant = 0,
  className,
  rounded = false,
}: {
  variant?: number
  className?: string
  rounded?: boolean
}) {
  const uid = useId().replace(/:/g, '')
  const p = PALETTES[Math.abs(variant) % PALETTES.length]
  const seed = Math.abs(variant) % 5
  const ridgeVariants = [
    `M0 224 C 54 196 92 210 140 184 C 196 154 242 188 296 166 C 340 148 376 162 400 150 L400 300 L0 300 Z`,
    `M0 238 C 62 210 104 226 158 196 C 218 162 258 196 316 174 C 356 160 382 168 400 162 L400 300 L0 300 Z`,
    `M0 210 C 44 200 86 172 132 184 C 184 198 222 160 270 168 C 318 176 356 152 400 158 L400 300 L0 300 Z`,
    `M0 248 C 58 224 108 238 156 214 C 212 186 260 208 308 186 C 348 168 380 176 400 168 L400 300 L0 300 Z`,
    `M0 226 C 50 214 96 186 150 200 C 206 214 246 180 300 190 C 344 198 374 184 400 176 L400 300 L0 300 Z`,
  ]
  const foreground = [
    `M0 262 C 70 238 118 260 176 246 C 240 230 288 254 340 240 C 368 232 386 236 400 232 L400 300 L0 300 Z`,
    `M0 272 C 62 252 116 268 178 258 C 242 248 292 264 348 252 C 374 246 388 248 400 246 L400 300 L0 300 Z`,
    `M0 256 C 56 248 112 264 170 254 C 228 244 286 258 344 248 C 372 244 388 248 400 246 L400 300 L0 300 Z`,
  ]

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={`${className ?? ''} ${rounded ? 'rounded-[3px]' : ''}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="52%" stopColor={p.sky[1]} />
          <stop offset="100%" stopColor={p.sky[2]} />
        </linearGradient>
        <linearGradient id={`ridge-${uid}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={p.ridge[0]} />
          <stop offset="100%" stopColor={p.ridge[1]} />
        </linearGradient>
        <linearGradient id={`water-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.water} stopOpacity="0.9" />
          <stop offset="100%" stopColor={p.ridge[1]} />
        </linearGradient>
        <radialGradient id={`sun-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.sun} stopOpacity="0.95" />
          <stop offset="45%" stopColor={p.sun} stopOpacity="0.35" />
          <stop offset="100%" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
        <filter id={`soft-${uid}`}>
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`grain-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.22" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="400" height="300" fill={`url(#sky-${uid})`} />
      <circle cx={p.sunX} cy={p.sunY} r="52" fill={`url(#sun-${uid})`} filter={`url(#soft-${uid})`} />
      <circle cx={p.sunX} cy={p.sunY} r="13" fill={p.sun} opacity="0.9" />
      {seed % 2 === 0 && (
        <path
          d={`M0 ${188 + seed * 6} C 80 ${170 + seed * 4} 150 ${196 + seed * 2} 220 ${182} C 290 ${168} 350 ${186} 400 ${174} L400 300 L0 300 Z`}
          fill={p.sky[1]}
          opacity="0.24"
        />
      )}
      <path d={ridgeVariants[seed]} fill={`url(#ridge-${uid})`} />
      <path
        d={ridgeVariants[seed]}
        fill="none"
        stroke={p.sun}
        strokeOpacity="0.22"
        strokeWidth="1.2"
        filter={`url(#soft-${uid})`}
      />
      <path d={foreground[seed % 3]} fill={p.ridge[1]} opacity="0.95" />
      <path
        d={`M0 ${244 + (seed % 3) * 6} C 70 232 130 252 190 246 C 250 240 310 254 400 240 L400 300 L0 300 Z`}
        fill={`url(#water-${uid})`}
        opacity="0.5"
      />
      <rect width="400" height="300" filter={`url(#grain-${uid})`} opacity="0.35" />
      <rect width="400" height="300" fill="url(#vignette)" opacity="0" />
    </svg>
  )
}

export function AlbumCover({ variant = 0, className }: { variant?: number; className?: string }) {
  return <PhotoArt variant={variant + 3} className={className} />
}
