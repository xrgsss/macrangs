import { useId } from 'react'

interface Palette {
  sky: [string, string, string]
  sun: string
  sunSoft: string
  warm: [string, string, string]
  cool: [string, string]
  deep: [string, string]
  rim: string
  rimCool: string
  mountain: string
}

export const WALLPAPERS: { id: string; name: string; subtitle: string; palette: Palette }[] = [
  {
    id: 'big-sur',
    name: 'Big Sur',
    subtitle: 'Dynamic Desktop',
    palette: {
      sky: ['#07132b', '#123f6b', '#0a1a38'],
      sun: '#ff9147',
      sunSoft: '#ff4f74',
      warm: ['#ff8a3d', '#f0476e', '#7b4ab5'],
      cool: ['#2c79a8', '#3f8fbd'],
      deep: ['#101c40', '#070d22'],
      rim: '#ffc79a',
      rimCool: '#8fd4ee',
      mountain: '#080f24',
    },
  },
  {
    id: 'solstice',
    name: 'Solstice',
    subtitle: 'Warm gradient',
    palette: {
      sky: ['#1c0f2e', '#5b2350', '#1a1233'],
      sun: '#ffbe5c',
      sunSoft: '#ff5d5d',
      warm: ['#ffc35c', '#ff6d4d', '#a83a7c'],
      cool: ['#7b4b96', '#c07a8f'],
      deep: ['#331633', '#120a22'],
      rim: '#ffe0a8',
      rimCool: '#f4b6c8',
      mountain: '#150b22',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    subtitle: 'Teal gradient',
    palette: {
      sky: ['#031a28', '#0b4a5e', '#041824'],
      sun: '#7ef0d4',
      sunSoft: '#3aa8dd',
      warm: ['#4fd6bf', '#2e8fc4', '#3d4fae'],
      cool: ['#226f96', '#4ba7b8'],
      deep: ['#072a38', '#03131f'],
      rim: '#b8fff2',
      rimCool: '#9fe8ff',
      mountain: '#041019',
    },
  },
  {
    id: 'dusk',
    name: 'Dusk',
    subtitle: 'Purple gradient',
    palette: {
      sky: ['#160d33', '#3c2a6e', '#1b1233'],
      sun: '#ff93c9',
      sunSoft: '#7b6bff',
      warm: ['#ff9ac8', '#a06bd8', '#5252c8'],
      cool: ['#4d5fbb', '#7e6ecf'],
      deep: ['#241a4d', '#100a25'],
      rim: '#ffd2f2',
      rimCool: '#b6c1ff',
      mountain: '#0c0720',
    },
  },
  {
    id: 'graphite',
    name: 'Graphite',
    subtitle: 'Monochrome',
    palette: {
      sky: ['#14181f', '#3d454f', '#161b22'],
      sun: '#dbe3ea',
      sunSoft: '#8b98a5',
      warm: ['#c6ced6', '#8894a0', '#4b535e'],
      cool: ['#6c7885', '#9aa6b2'],
      deep: ['#262c34', '#10141a'],
      rim: '#ffffff',
      rimCool: '#dfe6ec',
      mountain: '#0b0e13',
    },
  },
]

interface WallpaperProps {
  variant?: string
  className?: string
}

export function Wallpaper({ variant = 'big-sur', className }: WallpaperProps) {
  const uid = useId().replace(/:/g, '')
  const wp = WALLPAPERS.find((w) => w.id === variant) ?? WALLPAPERS[0]
  const p = wp.palette
  const id = (n: string) => `${uid}-${n}`

  return (
    <svg
      className={className}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="52%" stopColor={p.sky[1]} />
          <stop offset="100%" stopColor={p.sky[2]} />
        </linearGradient>
        <radialGradient id={id('sun')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.sun} stopOpacity="0.95" />
          <stop offset="45%" stopColor={p.sun} stopOpacity="0.5" />
          <stop offset="100%" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('sunSoft')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.sunSoft} stopOpacity="0.85" />
          <stop offset="55%" stopColor={p.sunSoft} stopOpacity="0.32" />
          <stop offset="100%" stopColor={p.sunSoft} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('coolGlow')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.cool[1]} stopOpacity="0.6" />
          <stop offset="100%" stopColor={p.cool[1]} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('warm')} x1="0" y1="0.05" x2="0.9" y2="0.95">
          <stop offset="0%" stopColor={p.warm[0]} />
          <stop offset="28%" stopColor={p.warm[0]} />
          <stop offset="52%" stopColor={p.warm[1]} />
          <stop offset="78%" stopColor={p.warm[2]} />
          <stop offset="100%" stopColor={p.deep[0]} />
        </linearGradient>
        <linearGradient id={id('warmDeep')} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={p.warm[1]} />
          <stop offset="55%" stopColor={p.warm[2]} />
          <stop offset="100%" stopColor={p.cool[0]} />
        </linearGradient>
        <linearGradient id={id('bandDeep')} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={p.deep[0]} />
          <stop offset="100%" stopColor={p.deep[1]} />
        </linearGradient>
        <linearGradient id={id('mountain')} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={p.mountain} stopOpacity="0.94" />
          <stop offset="100%" stopColor={p.mountain} />
        </linearGradient>
        <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={p.rim} stopOpacity="0" />
          <stop offset="28%" stopColor={p.rim} stopOpacity="0.95" />
          <stop offset="62%" stopColor={p.rim} stopOpacity="0.55" />
          <stop offset="100%" stopColor={p.rimCool} stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={id('coolBand')} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor={p.cool[0]} stopOpacity="0.15" />
          <stop offset="55%" stopColor={p.cool[0]} stopOpacity="0.75" />
          <stop offset="100%" stopColor={p.cool[1]} stopOpacity="0.4" />
        </linearGradient>
        <filter id={id('blurXL')} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="110" />
        </filter>
        <filter id={id('blurL')} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="46" />
        </filter>
        <filter id={id('blurM')} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={id('blurS')} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={id('grain')} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.32" />
          </feComponentTransfer>
        </filter>
        <radialGradient id={id('vignette')} cx="50%" cy="46%" r="78%">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.42" />
        </radialGradient>
        <clipPath id={id('frame')}>
          <rect width="1600" height="1000" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id('frame')})`}>
        <rect width="1600" height="1000" fill={`url(#${id('sky')})`} />

        {/* atmospheric light */}
        <g filter={`url(#${id('blurXL')})`}>
          <ellipse cx="330" cy="382" rx="520" ry="390" fill={`url(#${id('sun')})`} />
          <ellipse cx="700" cy="500" rx="460" ry="330" fill={`url(#${id('sunSoft')})`} />
          <ellipse cx="1190" cy="260" rx="620" ry="380" fill={`url(#${id('coolGlow')})`} opacity="0.9" />
          <ellipse cx="1480" cy="600" rx="470" ry="350" fill={`url(#${id('sunSoft')})`} opacity="0.55" />
          <ellipse cx="860" cy="770" rx="420" ry="220" fill={`url(#${id('sun')})`} opacity="0.2" />
        </g>

        {/* distant ridge line */}
        <path
          d="M-80 418 C 190 310 380 366 600 310 C 850 246 1030 334 1270 268 C 1400 234 1500 258 1680 208 L1680 1010 L-80 1010 Z"
          fill={`url(#${id('bandDeep')})`}
          opacity="0.6"
        />

        {/* upper silk veil */}
        <path
          d="M-80 642 C 150 496 350 532 548 456 C 758 376 950 422 1140 354 C 1310 294 1470 324 1680 274 L1680 1010 L-80 1010 Z"
          fill={`url(#${id('warm')})`}
          opacity="0.3"
        />
        <path
          d="M-80 628 C 156 486 354 522 554 446 C 764 366 956 412 1146 344 C 1316 284 1476 314 1680 266"
          fill="none"
          stroke={p.rim}
          strokeWidth="2"
          opacity="0.26"
          filter={`url(#${id('blurM')})`}
        />

        {/* main warm flowing ribbon */}
        <path
          d="M-80 812 C 150 606 336 646 532 566 C 746 480 922 520 1104 456 C 1268 398 1432 420 1680 362 L1680 1010 L-80 1010 Z"
          fill={`url(#${id('warm')})`}
          opacity="0.97"
        />

        {/* inner glow along the silk fold */}
        <path
          d="M-80 792 C 160 590 342 632 540 550 C 752 464 928 506 1110 440 C 1274 382 1438 404 1680 348 L1680 1010 L-80 1010 Z"
          fill={`url(#${id('sunSoft')})`}
          opacity="0.16"
        />

        {/* silk highlight over warm band */}
        <path
          d="M-80 794 C 160 594 346 636 542 556 C 756 470 932 512 1114 446 C 1278 388 1442 410 1680 354"
          fill="none"
          stroke={`url(#${id('rim')})`}
          strokeWidth="12"
          opacity="0.55"
          filter={`url(#${id('blurM')})`}
        />
        <path
          d="M-80 798 C 164 598 350 640 546 560 C 760 474 936 516 1118 450 C 1282 392 1446 414 1680 358"
          fill="none"
          stroke={p.rim}
          strokeWidth="1.8"
          opacity="0.62"
          filter={`url(#${id('blurS')})`}
        />
        <path
          d="M-80 722 C 176 540 354 584 554 500 C 764 412 946 458 1120 392 C 1284 330 1444 356 1680 300"
          fill="none"
          stroke={p.rimCool}
          strokeWidth="1.1"
          opacity="0.24"
          filter={`url(#${id('blurS')})`}
        />

        {/* mid cool shadow band */}
        <path
          d="M-80 866 C 130 714 336 758 526 704 C 766 638 912 700 1092 638 C 1280 574 1440 650 1680 578 L1680 1010 L-80 1010 Z"
          fill={`url(#${id('warmDeep')})`}
          opacity="0.5"
        />

        {/* deep foreground dune */}
        <path
          d="M-80 926 C 140 772 334 810 544 786 C 784 756 904 824 1104 808 C 1304 792 1462 856 1680 814 L1680 1010 L-80 1010 Z"
          fill={`url(#${id('bandDeep')})`}
          opacity="0.9"
        />

        <path
          d="M-80 914 C 140 762 334 802 544 776 C 784 746 904 814 1104 798 C 1304 782 1462 846 1680 804"
          fill="none"
          stroke={`url(#${id('rim')})`}
          strokeWidth="3"
          opacity="0.5"
          filter={`url(#${id('blurM')})`}
        />

        {/* forward mountain silhouette */}
        <path
          d="M-80 1008 L-80 926 C 90 868 204 852 334 878 C 502 906 594 894 732 840 C 882 780 1022 812 1182 870 C 1322 920 1482 916 1680 872 L1680 1008 Z"
          fill={`url(#${id('mountain')})`}
          opacity="0.94"
        />

        {/* cool foreground light on right */}
        <path
          d="M860 1008 C 1030 906 1174 876 1316 886 C 1448 896 1532 938 1680 926 L1680 1008 Z"
          fill={`url(#${id('coolBand')})`}
          opacity="0.46"
        />
        <path
          d="M-80 1008 C 60 948 166 932 288 952 C 396 970 470 962 560 936 L560 1008 Z"
          fill={`url(#${id('coolBand')})`}
          opacity="0.2"
        />

        {/* soft light leak top-left */}
        <ellipse
          cx="120"
          cy="80"
          rx="420"
          ry="260"
          fill={p.sunSoft}
          opacity="0.16"
          filter={`url(#${id('blurXL')})`}
        />

        <rect width="1600" height="1000" fill={`url(#${id('vignette')})`} />
        <rect width="1600" height="1000" filter={`url(#${id('grain')})`} opacity="0.1" />
      </g>
    </svg>
  )
}
