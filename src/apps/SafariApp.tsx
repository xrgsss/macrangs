import { useMemo, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  MoreHorizontal,
  Plus,
  RotateCw,
  Search,
  Share,
  Shield,
  Star,
  PanelLeft,
} from 'lucide-react'
import { AppleLogo } from '../components/AppIcons'
import { PhotoArt } from '../components/Artwork'

type SiteId = 'apple' | 'github' | 'wikipedia' | 'youtube' | 'figma' | 'x' | 'dribbble' | 'nyt'

interface PageState {
  kind: 'start' | 'site' | 'search'
  site?: SiteId
  query?: string
  url: string
}

const SITES: Record<
  SiteId,
  { name: string; host: string; tint: string; gradient: string; icon: ReactNode }
> = {
  apple: {
    name: 'Apple',
    host: 'apple.com',
    tint: '#1d1d1f',
    gradient: 'linear-gradient(135deg,#f5f5f7,#dfe3e8)',
    icon: <AppleLogo className="h-[13px] w-[13px] text-[#1d1d1f]" />,
  },
  github: {
    name: 'GitHub',
    host: 'github.com',
    tint: '#24292f',
    gradient: 'linear-gradient(135deg,#3a3a3a,#111)',
    icon: <span className="text-[13px] font-bold text-white">G</span>,
  },
  wikipedia: {
    name: 'Wikipedia',
    host: 'wikipedia.org',
    tint: '#3366cc',
    gradient: 'linear-gradient(135deg,#f7f7f7,#d8dde3)',
    icon: <span className="text-[15px] font-serif font-bold text-[#333]">W</span>,
  },
  youtube: {
    name: 'YouTube',
    host: 'youtube.com',
    tint: '#ff0033',
    gradient: 'linear-gradient(135deg,#ff4b4b,#c4001d)',
    icon: <span className="text-[8px] font-bold tracking-tight text-white">YT</span>,
  },
  figma: {
    name: 'Figma',
    host: 'figma.com',
    tint: '#a259ff',
    gradient: 'linear-gradient(135deg,#2c2c32,#0e0e12)',
    icon: <span className="text-[13px] font-bold text-white">F</span>,
  },
  x: {
    name: 'X',
    host: 'x.com',
    tint: '#0f1419',
    gradient: 'linear-gradient(135deg,#2b2b2b,#050505)',
    icon: <span className="text-[13px] font-bold text-white">𝕏</span>,
  },
  dribbble: {
    name: 'Dribbble',
    host: 'dribbble.com',
    tint: '#ea4c89',
    gradient: 'linear-gradient(135deg,#f27eb2,#d43a75)',
    icon: <span className="text-[13px] font-bold text-white">D</span>,
  },
  nyt: {
    name: 'The New York Times',
    host: 'nytimes.com',
    tint: '#111111',
    gradient: 'linear-gradient(135deg,#ffffff,#e7e7e7)',
    icon: <span className="font-serif text-[13px] font-bold text-black">T</span>,
  },
}

const FAVORITES: SiteId[] = ['apple', 'github', 'wikipedia', 'youtube', 'figma', 'x', 'dribbble', 'nyt']

export function SafariApp() {
  const [history, setHistory] = useState<PageState[]>([
    { kind: 'start', url: 'Start Page' },
  ])
  const [index, setIndex] = useState(0)
  const [address, setAddress] = useState('Start Page')
  const [loaded, setLoaded] = useState(true)
  const [showStart, setShowStart] = useState(true)
  const current = history[index]

  const go = (page: PageState) => {
    const next = history.slice(0, index + 1)
    next.push(page)
    setHistory(next)
    setIndex(next.length - 1)
    setAddress(page.url)
    setLoaded(true)
    setShowStart(page.kind === 'start')
  }

  const goSite = (id: SiteId) => {
    const site = SITES[id]
    go({ kind: 'site', site: id, url: site.host })
  }

  const back = () => {
    if (index === 0) return
    const next = index - 1
    setIndex(next)
    setAddress(history[next].url)
    setShowStart(history[next].kind === 'start')
  }
  const forward = () => {
    if (index >= history.length - 1) return
    const next = index + 1
    setIndex(next)
    setAddress(history[next].url)
    setShowStart(history[next].kind === 'start')
  }

  const submit = () => {
    const value = address.trim()
    if (!value) return
    const match = (Object.keys(SITES) as SiteId[]).find(
      (k) => SITES[k].host.replace('www.', '') === value.replace(/^https?:\/\//, '').replace(/\/$/, '') || k === value.toLowerCase(),
    )
    if (match) {
      goSite(match)
    } else if (value === 'Start Page') {
      go({ kind: 'start', url: 'Start Page' })
    } else {
      go({ kind: 'search', query: value, url: `Search · ${value}` })
    }
  }

  const reload = () => {
    setLoaded(false)
    window.setTimeout(() => setLoaded(true), 260)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[#1d1d1f]">
      <div className="flex h-[44px] shrink-0 items-center gap-[6px] border-b border-black/[0.08] bg-[#f2f2f4]/90 px-[10px] backdrop-blur-xl">
        <div className="flex items-center gap-[1px] text-black/55">
          <ChromeButton label="Back" onClick={back} disabled={index === 0}>
            <ChevronLeft className="h-[17px] w-[17px]" strokeWidth={2} />
          </ChromeButton>
          <ChromeButton label="Forward" onClick={forward} disabled={index >= history.length - 1}>
            <ChevronRight className="h-[17px] w-[17px]" strokeWidth={2} />
          </ChromeButton>
        </div>
        <ChromeButton label="Sidebar" onClick={() => {}}>
          <PanelLeft className="h-[15px] w-[15px]" strokeWidth={2} />
        </ChromeButton>

        <div className="flex min-w-0 flex-1 justify-center">
          <div className="flex h-[28px] w-full max-w-[540px] items-center gap-[6px] rounded-[7px] border border-black/[0.07] bg-white/80 px-[8px] shadow-[inset_0_0.5px_1px_rgba(0,0,0,0.03)] focus-within:ring-2 focus-within:ring-[#0a84ff]/35">
            {current.kind === 'start' ? (
              <Search className="h-[12px] w-[12px] shrink-0 text-black/35" />
            ) : (
              <Lock className="h-[11px] w-[11px] shrink-0 text-black/35" />
            )}
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur()
                  submit()
                }
              }}
              onFocus={(e) => e.currentTarget.select()}
              spellCheck={false}
              className="w-full bg-transparent text-center text-[12px] tracking-[-0.05px] text-[#3a3a3c] outline-none"
            />
            <button
              onClick={reload}
              aria-label="Reload page"
              className="grid h-[17px] w-[17px] shrink-0 place-items-center rounded text-black/35 hover:text-black/60"
            >
              <RotateCw className="h-[11px] w-[11px]" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-[1px] text-black/55">
          <ChromeButton label="Share" onClick={() => {}}>
            <Share className="h-[15px] w-[15px]" strokeWidth={2} />
          </ChromeButton>
          <ChromeButton label="New Tab" onClick={() => go({ kind: 'start', url: 'Start Page' })}>
            <Plus className="h-[16px] w-[16px]" strokeWidth={2} />
          </ChromeButton>
          <ChromeButton label="Downloads" onClick={() => {}}>
            <Download className="h-[15px] w-[15px]" strokeWidth={2} />
          </ChromeButton>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {current.kind === 'start' ? (
          <StartPage onOpen={goSite} />
        ) : current.kind === 'search' ? (
          <SearchResults query={current.query ?? ''} onOpen={goSite} />
        ) : (
          <SitePage site={current.site ?? 'apple'} onOpen={goSite} />
        )}
        {!loaded && (
          <div className="absolute inset-x-0 top-0 h-[2px] overflow-hidden bg-transparent">
            <div className="h-full w-1/3 animate-[loadingBar_0.8s_ease-in-out_infinite] bg-[#0a84ff]" />
          </div>
        )}
      </div>
    </div>
  )
}

function ChromeButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-[26px] w-[28px] place-items-center rounded-[5px] ${
        disabled ? 'text-black/20' : 'hover:bg-black/[0.06] active:bg-black/[0.1]'
      }`}
    >
      {children}
    </button>
  )
}

function StartPage({ onOpen }: { onOpen: (id: SiteId) => void }) {
  return (
    <div
      className="min-h-full px-[26px] pb-10 pt-[38px] sm:px-[52px]"
      style={{
        background: 'linear-gradient(180deg, #f7f7f9 0%, #ffffff 48%, #fbfbfc 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[780px]">
        <h2 className="mb-[13px] text-[15px] font-bold tracking-[-0.2px] text-[#1d1d1f]">Favorites</h2>
        <div className="grid grid-cols-4 gap-[12px] sm:grid-cols-8 sm:gap-[14px]">
          {FAVORITES.map((id) => {
            const site = SITES[id]
            return (
              <button
                key={id}
                onClick={() => onOpen(id)}
                className="group flex flex-col items-center gap-[7px] rounded-[8px] py-[2px] outline-none"
              >
                <span
                  className="grid h-[54px] w-[54px] place-items-center rounded-[12px] border border-black/[0.06] shadow-[0_2px_6px_rgba(0,0,0,0.1)] transition-transform duration-150 group-hover:scale-[1.06] group-active:scale-95 sm:h-[58px] sm:w-[58px]"
                  style={{ background: site.gradient }}
                >
                  {site.icon}
                </span>
                <span className="w-full truncate text-center text-[11px] leading-[13px] text-[#3a3a3c]">
                  {site.name}
                </span>
              </button>
            )
          })}
        </div>

        <h2 className="mb-[13px] mt-[30px] text-[15px] font-bold tracking-[-0.2px] text-[#1d1d1f]">
          Privacy Report
        </h2>
        <div className="flex flex-col gap-[14px] rounded-[12px] border border-black/[0.07] bg-white/90 p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center">
          <div className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-[#0a84ff]/10">
            <Shield className="h-[24px] w-[24px] text-[#0a84ff]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[22px] font-semibold tracking-[-0.6px] text-[#1d1d1f]">23</p>
            <p className="text-[12px] text-black/50">Trackers prevented from profiling you in the last 7 days.</p>
          </div>
          <button
            onClick={() => onOpen('apple')}
            className="self-start rounded-[7px] bg-black/[0.055] px-[12px] py-[4px] text-[11.5px] font-medium text-[#0a84ff] hover:bg-black/[0.08] sm:self-auto"
          >
            Show Report
          </button>
        </div>

        <h2 className="mb-[13px] mt-[28px] text-[15px] font-bold tracking-[-0.2px] text-[#1d1d1f]">
          Reading List
        </h2>
        <div className="grid gap-[12px] sm:grid-cols-2">
          {[
            { title: 'The quiet craft behind macOS Big Sur', site: 'The Verge', variant: 6, id: 'wikipedia' as SiteId },
            { title: 'Designing for the desktop of tomorrow', site: 'Dribbble Stories', variant: 0, id: 'dribbble' as SiteId },
          ].map((item) => (
            <button
              key={item.title}
              onClick={() => onOpen(item.id)}
              className="flex items-center gap-[12px] rounded-[10px] border border-black/[0.06] bg-white/80 p-[10px] text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-white"
            >
              <PhotoArt variant={item.variant} className="h-[56px] w-[76px] shrink-0 rounded-[7px]" />
              <div className="min-w-0">
                <p className="line-clamp-2 text-[12px] font-semibold leading-[16px] tracking-[-0.1px]">{item.title}</p>
                <p className="mt-[4px] text-[10.5px] text-black/40">{item.site}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-[30px] text-center text-[10.5px] text-black/25">
          iCloud Tabs · Safari 14.1 · Big Sur
        </p>
      </div>
    </div>
  )
}

function SearchResults({ query, onOpen }: { query: string; onOpen: (id: SiteId) => void }) {
  const results = useMemo(
    () => [
      { id: 'apple' as SiteId, title: 'Apple — macOS Big Sur', url: 'apple.com/macos/big-sur', desc: 'macOS Big Sur elevates the most advanced desktop operating system in the world to a new level of power and beauty.' },
      { id: 'wikipedia' as SiteId, title: 'macOS Big Sur - Wikipedia', url: 'en.wikipedia.org/wiki/MacOS_Big_Sur', desc: 'macOS Big Sur is the seventeenth major release of macOS, Apple Inc.\'s desktop operating system.' },
      { id: 'github' as SiteId, title: 'Big Sur UI — GitHub', url: 'github.com/design/big-sur', desc: 'A collection of components recreating the macOS Big Sur interface for the web.' },
      { id: 'youtube' as SiteId, title: 'Inside macOS Big Sur — YouTube', url: 'youtube.com/watch', desc: 'A first look at the redesigned interface, Control Center, and the new Safari experience.' },
    ],
    [],
  )

  return (
    <div className="mx-auto w-full max-w-[720px] px-[24px] py-[26px]">
      <p className="text-[11.5px] text-black/40">About 4 results for “{query}”</p>
      <div className="mt-[14px] space-y-[18px]">
        {results.map((r) => (
          <button key={r.id} onClick={() => onOpen(r.id)} className="block w-full text-left">
            <p className="text-[11px] text-black/45">{r.url}</p>
            <p className="mt-[2px] text-[16px] font-medium leading-[21px] text-[#0a5bd6] hover:underline">{r.title}</p>
            <p className="mt-[2px] text-[12px] leading-[17px] text-black/55">{r.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function SitePage({ site, onOpen }: { site: SiteId; onOpen: (id: SiteId) => void }) {
  if (site === 'apple') return <ApplePage onOpen={onOpen} />
  if (site === 'wikipedia') return <WikipediaPage />
  if (site === 'youtube') return <YouTubePage />
  if (site === 'github') return <GithubPage />
  const s = SITES[site]
  return (
    <div className="min-h-full bg-[#0d0d10] text-white">
      <div className="flex h-[52px] items-center justify-between border-b border-white/10 px-[28px]">
        <span className="text-[17px] font-semibold tracking-[-0.3px]">{s.name}</span>
        <div className="hidden gap-[18px] text-[12px] text-white/60 sm:flex">
          <span>Explore</span>
          <span>Stories</span>
          <span>About</span>
        </div>
      </div>
      <div className="relative overflow-hidden px-[28px] pb-[44px] pt-[54px]">
        <div
          className="absolute -right-20 -top-24 h-[380px] w-[380px] rounded-full opacity-50 blur-[90px]"
          style={{ background: s.tint }}
        />
        <div className="relative mx-auto max-w-[760px]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">{s.name} — Featured</p>
          <h1 className="mt-[14px] max-w-[620px] text-[42px] font-semibold leading-[1.05] tracking-[-1.6px]">
            A new perspective on visual storytelling.
          </h1>
          <p className="mt-[16px] max-w-[500px] text-[13.5px] leading-[21px] text-white/55">
            Curated work, thoughtful conversations, and the craft behind the world's most considered digital
            products.
          </p>
          <div className="mt-[26px] flex gap-[10px]">
            <button className="rounded-full bg-white px-[16px] py-[7px] text-[12px] font-semibold text-black hover:bg-white/90">
              Start exploring
            </button>
            <button className="rounded-full border border-white/20 px-[16px] py-[7px] text-[12px] font-medium text-white/80 hover:bg-white/10">
              Learn more
            </button>
          </div>
          <div className="mt-[40px] grid grid-cols-2 gap-[12px] sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-[10px] border border-white/10 bg-white/5">
                <PhotoArt variant={i * 3 + 2} className="h-[120px] w-full" />
                <div className="p-[10px]">
                  <p className="text-[11px] font-medium text-white/85">Editorial {String(i + 1).padStart(2, '0')}</p>
                  <p className="mt-[2px] text-[9.5px] text-white/35">5 min read</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ApplePage({ onOpen }: { onOpen: (id: SiteId) => void }) {
  return (
    <div className="min-h-full bg-white">
      <div className="flex h-[50px] items-center justify-between border-b border-black/[0.07] bg-[#fbfbfd] px-[30px]">
        <AppleLogo className="h-[17px] w-[17px] text-[#1d1d1f]" />
        <div className="hidden gap-[22px] text-[11.5px] text-[#1d1d1f]/80 sm:flex">
          <span>Store</span>
          <span>Mac</span>
          <span>iPad</span>
          <span>iPhone</span>
          <span>Watch</span>
          <span>AirPods</span>
          <span>TV & Home</span>
          <span>Support</span>
        </div>
        <Search className="h-[13px] w-[13px] text-black/50" />
      </div>
      <div className="bg-[#f5f5f7] px-[24px] pb-[28px] pt-[30px] text-center">
        <p className="text-[11px] font-semibold text-[#bf4800]">New</p>
        <h1 className="mt-[4px] text-[38px] font-semibold leading-none tracking-[-1.4px]">MacBook Pro</h1>
        <p className="mt-[10px] text-[13px] text-black/55">Supercharged by the M1 chip.</p>
        <div className="mt-[14px] flex justify-center gap-[18px] text-[12px] text-[#0066cc]">
          <button className="hover:underline" onClick={() => onOpen('github')}>Learn more</button>
          <button className="hover:underline" onClick={() => onOpen('apple')}>Buy</button>
        </div>
        <div className="relative mx-auto mt-[26px] h-[210px] w-full max-w-[560px] overflow-hidden rounded-t-[14px] sm:h-[250px]">
          <div style={{ background: 'linear-gradient(150deg,#101114,#2d313a 60%,#6f7480)' }} className="absolute inset-0" />
          <div className="absolute inset-x-[12%] top-[22px] h-[150px] rounded-[10px] border border-white/20 bg-gradient-to-b from-[#3e3f44] to-[#1b1c20] shadow-[0_20px_40px_rgba(0,0,0,0.4)] sm:h-[180px]">
            <div className="mx-auto mt-[9px] h-[3px] w-[34%] rounded-full bg-white/10" />
            <div className="mt-[16px] flex h-[105px] items-center justify-center gap-[10px] sm:h-[125px]">
              <div className="h-[70%] w-[48%] overflow-hidden rounded-[4px] border border-white/10 sm:w-[46%]">
                <PhotoArt variant={4} className="h-full w-full" />
              </div>
              <div className="w-[26%] space-y-[5px]">
                <div className="h-[5px] w-full rounded bg-white/20" />
                <div className="h-[4px] w-[80%] rounded bg-white/10" />
                <div className="h-[4px] w-[60%] rounded bg-white/10" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-[10px] left-1/2 h-[5px] w-[120px] -translate-x-1/2 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="grid gap-[1px] bg-[#d2d2d7] sm:grid-cols-2">
        <div className="bg-white p-[24px] text-center">
          <p className="text-[12px] font-semibold">M1 chip</p>
          <p className="mx-auto mt-[7px] max-w-[240px] text-[10.5px] leading-[16px] text-black/50">
            Up to 3.5x faster CPU performance and 6x faster graphics than the previous generation.
          </p>
        </div>
        <div className="bg-white p-[24px] text-center">
          <p className="text-[12px] font-semibold">Retina display</p>
          <p className="mx-auto mt-[7px] max-w-[240px] text-[10.5px] leading-[16px] text-black/50">
            A 13-inch display with 500 nits of brightness and P3 wide color.
          </p>
        </div>
      </div>
    </div>
  )
}

function WikipediaPage() {
  return (
    <div className="min-h-full bg-white px-[26px] py-[24px] font-serif text-[#202122] sm:px-[44px]">
      <div className="mx-auto max-w-[720px]">
        <p className="font-sans text-[10.5px] text-black/40">From Wikipedia, the free encyclopedia</p>
        <h1 className="mt-[4px] border-b border-black/20 pb-[6px] text-[28px] font-normal tracking-[-0.4px]">macOS Big Sur</h1>
        <div className="mt-[14px] flex flex-col gap-[18px] sm:flex-row">
          <div className="order-2 flex-1 font-sans text-[12px] leading-[19px] text-[#3d3d3d]">
            <p>
              <b>macOS Big Sur</b> (version 11) is the seventeenth major release of macOS, Apple's desktop
              operating system. It was announced at Apple's Worldwide Developers Conference on June 22, 2020,
              and released on November 12, 2020.
            </p>
            <p className="mt-[10px]">
              Big Sur brought the biggest redesign of the macOS interface since Mac OS X Yosemite in 2014,
              introducing a new Control Center, notification widgets, a redesigned Dock, and a completely new
              visual language with translucent surfaces and rounded corners.
            </p>
            <h2 className="mt-[16px] border-b border-black/10 pb-[3px] font-serif text-[18px] font-normal">Design</h2>
            <p className="mt-[8px]">
              The release adopted a lighter, more spacious aesthetic. Menus became more translucent, window
              chrome was reduced, and application icons were unified on a rounded square grid. The default
              wallpaper featured flowing gradients of orange, pink and blue.
            </p>
            <h2 className="mt-[16px] border-b border-black/10 pb-[3px] font-serif text-[18px] font-normal">Reception</h2>
            <p className="mt-[8px]">
              Reviewers praised the interface refinements and the performance improvements brought by Apple
              silicon. Some criticized early compatibility issues with third-party applications.
            </p>
          </div>
          <aside className="order-1 w-full shrink-0 rounded-[2px] border border-[#a2a9b1] bg-[#f8f9fa] p-[10px] font-sans text-[10.5px] sm:w-[220px]">
            <p className="mb-[6px] text-center font-bold">macOS Big Sur</p>
            <PhotoArt variant={1} className="h-[110px] w-full rounded-[2px]" />
            <div className="mt-[8px] space-y-[4px] leading-[14px]">
              <p><b>Developer:</b> Apple Inc.</p>
              <p><b>Released:</b> November 12, 2020</p>
              <p><b>Kernel type:</b> Hybrid (XNU)</p>
              <p><b>License:</b> Proprietary</p>
              <p><b>Preceded by:</b> macOS Catalina</p>
              <p><b>Succeeded by:</b> macOS Monterey</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function YouTubePage() {
  return (
    <div className="min-h-full bg-[#0f0f0f] text-white">
      <div className="flex h-[48px] items-center gap-[20px] border-b border-white/10 px-[22px]">
        <span className="text-[15px] font-semibold tracking-[-0.4px]">YouTube</span>
        <div className="hidden h-[26px] max-w-[300px] flex-1 items-center rounded-full border border-white/15 bg-white/5 px-[10px] sm:flex">
          <span className="text-[10px] text-white/35">Search</span>
        </div>
      </div>
      <div className="mx-auto max-w-[820px] px-[20px] py-[18px]">
        <div className="relative overflow-hidden rounded-[10px] bg-black">
          <PhotoArt variant={8} className="h-[260px] w-full opacity-80 sm:h-[330px]" />
          <button className="absolute inset-0 grid place-items-center" aria-label="Play video">
            <span className="grid h-[54px] w-[54px] place-items-center rounded-full bg-black/50 backdrop-blur-sm">
              <span className="ml-[3px] h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
            </span>
          </button>
          <div className="absolute inset-x-0 bottom-0 h-[70px] bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-[8px] left-[12px] right-[12px] flex items-center gap-[8px]">
            <div className="h-[2px] flex-1 rounded bg-white/25">
              <div className="h-full w-[34%] rounded bg-[#ff0033]" />
            </div>
            <span className="text-[9px] text-white/60">4:12 / 12:08</span>
          </div>
        </div>
        <h1 className="mt-[14px] text-[16px] font-semibold leading-[21px]">Inside macOS Big Sur — the redesign, in detail</h1>
        <div className="mt-[8px] flex items-center gap-[10px]">
          <div className="grid h-[30px] w-[30px] place-items-center rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#a339ff] text-[11px] font-bold">D</div>
          <div>
            <p className="text-[11px] font-medium">Design Channel</p>
            <p className="text-[9.5px] text-white/40">284K subscribers</p>
          </div>
          <button className="ml-auto rounded-full bg-[#ff0033] px-[12px] py-[4px] text-[10.5px] font-semibold">Subscribe</button>
        </div>
        <div className="mt-[14px] flex gap-[10px]">
          {[3, 5, 7].map((v) => (
            <div key={v} className="w-1/3">
              <PhotoArt variant={v} className="h-[70px] w-full rounded-[6px] sm:h-[88px]" />
              <p className="mt-[5px] line-clamp-1 text-[10px] leading-[13px]">A closer look at the new interface</p>
              <p className="text-[8.5px] text-white/35">Design Channel · 120K views</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GithubPage() {
  return (
    <div className="min-h-full bg-[#0d1117] px-[22px] py-[20px] font-sans text-[#c9d1d9]">
      <div className="mx-auto max-w-[760px]">
        <p className="text-[10px] text-[#8b949e]">design / big-sur-ui</p>
        <h1 className="mt-[4px] text-[19px] font-semibold text-[#58a6ff]">big-sur-ui</h1>
        <p className="mt-[6px] text-[11.5px] leading-[18px] text-[#8b949e]">
          A faithful recreation of the macOS Big Sur desktop interface, built with React, TypeScript and
          Framer Motion.
        </p>
        <div className="mt-[12px] flex gap-[16px] border-b border-[#30363d] pb-[10px] text-[10.5px] text-[#8b949e]">
          <span className="border-b-2 border-[#f78166] pb-[8px] text-[#c9d1d9]">Code</span>
          <span>Issues <span className="rounded-full bg-[#30363d] px-[5px]">2</span></span>
          <span>Pull requests</span>
          <span>Actions</span>
        </div>
        <div className="mt-[12px] overflow-hidden rounded-[6px] border border-[#30363d]">
          <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-[10px] py-[6px] text-[10px]">
            <span className="font-medium text-[#c9d1d9]">main</span>
            <span className="text-[#8b949e]">3 branches · 24 commits</span>
          </div>
          {[
            ['src', 'Update dock magnification spring', '2 hours ago'],
            ['public', 'Add Big Sur wallpaper assets', 'yesterday'],
            ['package.json', 'Bump framer-motion to 11.15', '2 days ago'],
            ['README.md', 'Document keyboard shortcuts', '3 days ago'],
          ].map(([name, msg, when]) => (
            <div key={name} className="flex items-center gap-[8px] border-b border-[#21262d] px-[10px] py-[6px] text-[10.5px] last:border-0 hover:bg-[#161b22]">
              <span className="text-[#7ee787]">◈</span>
              <span className="w-[80px] shrink-0 text-[#58a6ff]">{name}</span>
              <span className="min-w-0 flex-1 truncate text-[#8b949e]">{msg}</span>
              <span className="hidden shrink-0 text-[9px] text-[#6e7681] sm:block">{when}</span>
            </div>
          ))}
        </div>
        <div className="mt-[12px] rounded-[6px] border border-[#30363d] bg-[#161b22] p-[10px]">
          <p className="text-[10px] text-[#8b949e]">README.md</p>
          <pre className="mt-[6px] overflow-x-auto text-[10px] leading-[16px] text-[#c9d1d9]">
{`# Big Sur UI
A web-based macOS desktop simulation.

- React + TypeScript
- Framer Motion spring physics
- Frosted glass surfaces
`}
          </pre>
        </div>
      </div>
    </div>
  )
}
