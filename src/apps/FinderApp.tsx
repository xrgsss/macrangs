import { useMemo, useState, type ReactNode } from 'react'
import {
  Airplay,
  AppWindow,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ChevronRight,
  Clock,
  Cloud,
  Download,
  FileText,
  HardDrive,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Monitor,
  MoreHorizontal,
  Music2,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { APP_ICONS, FileIcon, FolderIcon } from '../components/AppIcons'
import { PhotoArt } from '../components/Artwork'
import type { AppId } from '../types'

interface FsItem {
  id: string
  name: string
  kind: 'folder' | 'image' | 'doc' | 'app' | 'audio'
  appId?: AppId
  variant?: number
  size?: string
  modified?: string
}

const DEFAULT_MODIFIED = 'Today, 09:41'

const FS: Record<string, FsItem[]> = {
  Recents: [
    { id: 'r1', name: 'Projects', kind: 'folder', modified: 'Today, 09:32' },
    { id: 'r2', name: 'Big Sur.tiff', kind: 'image', variant: 0, size: '8.4 MB' },
    { id: 'r3', name: 'Design Notes.txt', kind: 'doc', size: '12 KB' },
    { id: 'r4', name: 'Sunset Study.jpg', kind: 'image', variant: 2, size: '4.1 MB' },
    { id: 'r5', name: 'Budget.numbers', kind: 'doc', size: '420 KB' },
    { id: 'r6', name: 'Safari', kind: 'app', appId: 'safari' },
  ],
  Desktop: [
    { id: 'd1', name: 'Projects', kind: 'folder' },
    { id: 'd2', name: 'Wallpapers', kind: 'folder' },
    { id: 'd3', name: 'Big Sur.tiff', kind: 'image', variant: 0, size: '8.4 MB' },
    { id: 'd4', name: 'Design Notes.txt', kind: 'doc', size: '12 KB' },
    { id: 'd5', name: 'Sunset Study.jpg', kind: 'image', variant: 2, size: '4.1 MB' },
  ],
  Projects: [
    { id: 'p1', name: 'Big Sur UI', kind: 'folder' },
    { id: 'p2', name: 'Icons', kind: 'folder' },
    { id: 'p3', name: 'concept.fig', kind: 'doc', size: '2.2 MB' },
    { id: 'p4', name: 'Palette.png', kind: 'image', variant: 4, size: '620 KB' },
    { id: 'p5', name: 'README.md', kind: 'doc', size: '4 KB' },
  ],
  'Big Sur UI': [
    { id: 'b1', name: 'Desktop.png', kind: 'image', variant: 1, size: '1.8 MB' },
    { id: 'b2', name: 'Dock.png', kind: 'image', variant: 6, size: '980 KB' },
    { id: 'b3', name: 'Notes.txt', kind: 'doc', size: '2 KB' },
  ],
  Icons: [
    { id: 'i1', name: 'Finder.svg', kind: 'doc', size: '18 KB' },
    { id: 'i2', name: 'Safari.svg', kind: 'doc', size: '24 KB' },
    { id: 'i3', name: 'Photos.svg', kind: 'doc', size: '31 KB' },
  ],
  Wallpapers: [
    { id: 'w1', name: 'Big Sur.png', kind: 'image', variant: 0, size: '6.2 MB' },
    { id: 'w2', name: 'Solstice.png', kind: 'image', variant: 1, size: '5.8 MB' },
    { id: 'w3', name: 'Aurora.png', kind: 'image', variant: 6, size: '5.1 MB' },
    { id: 'w4', name: 'Dusk.png', kind: 'image', variant: 8, size: '6.9 MB' },
  ],
  Documents: [
    { id: 'doc1', name: 'Invoices', kind: 'folder' },
    { id: 'doc2', name: 'Resume.pdf', kind: 'doc', size: '182 KB' },
    { id: 'doc3', name: 'Budget.numbers', kind: 'doc', size: '420 KB' },
    { id: 'doc4', name: 'Ideas.md', kind: 'doc', size: '9 KB' },
  ],
  Invoices: [
    { id: 'inv1', name: 'Invoice 0241.pdf', kind: 'doc', size: '88 KB' },
    { id: 'inv2', name: 'Invoice 0240.pdf', kind: 'doc', size: '91 KB' },
  ],
  Downloads: [
    { id: 'dl1', name: 'macOS Big Sur.dmg', kind: 'doc', size: '11.2 GB' },
    { id: 'dl2', name: 'wallpaper.jpg', kind: 'image', variant: 3, size: '3.4 MB' },
    { id: 'dl3', name: 'Podcast.mp3', kind: 'audio', size: '42 MB' },
    { id: 'dl4', name: 'Archive', kind: 'folder' },
  ],
  Archive: [
    { id: 'ar1', name: 'Screenshots', kind: 'folder' },
    { id: 'ar2', name: 'old-site.zip', kind: 'doc', size: '14 MB' },
  ],
  Pictures: [
    { id: 'ph1', name: 'Big Sur 01.jpg', kind: 'image', variant: 0, size: '4.4 MB' },
    { id: 'ph2', name: 'Big Sur 02.jpg', kind: 'image', variant: 1, size: '3.9 MB' },
    { id: 'ph3', name: 'Sunset.jpg', kind: 'image', variant: 2, size: '5.1 MB' },
    { id: 'ph4', name: 'Blue Hour.jpg', kind: 'image', variant: 3, size: '4.8 MB' },
    { id: 'ph5', name: 'Forest.jpg', kind: 'image', variant: 4, size: '6.2 MB' },
    { id: 'ph6', name: 'Night Drive.jpg', kind: 'image', variant: 5, size: '3.7 MB' },
  ],
  Music: [{ id: 'mu1', name: 'Tadow.mp3', kind: 'audio', size: '8.1 MB' }],
  Movies: [{ id: 'mv1', name: 'Big Sur Timelapse.mov', kind: 'doc', size: '184 MB' }],
  Applications: [
    { id: 'a1', name: 'Safari', kind: 'app', appId: 'safari' },
    { id: 'a2', name: 'Messages', kind: 'app', appId: 'messages' },
    { id: 'a3', name: 'Mail', kind: 'app', appId: 'mail' },
    { id: 'a4', name: 'Photos', kind: 'app', appId: 'photos' },
    { id: 'a5', name: 'Calendar', kind: 'app', appId: 'calendar' },
    { id: 'a6', name: 'Notes', kind: 'app', appId: 'notes' },
    { id: 'a7', name: 'Music', kind: 'app', appId: 'music' },
    { id: 'a8', name: 'Maps', kind: 'app', appId: 'maps' },
    { id: 'a9', name: 'App Store', kind: 'app', appId: 'appstore' },
    { id: 'a10', name: 'System Preferences', kind: 'app', appId: 'settings' },
  ],
  'iCloud Drive': [
    { id: 'ic1', name: 'Pages', kind: 'folder' },
    { id: 'ic2', name: 'Numbers', kind: 'folder' },
    { id: 'ic3', name: 'Keynote', kind: 'folder' },
    { id: 'ic4', name: 'Shared Notes.txt', kind: 'doc', size: '6 KB' },
  ],
  Shared: [
    { id: 'sh1', name: 'Team Sync', kind: 'folder' },
    { id: 'sh2', name: 'Screenshots', kind: 'folder' },
  ],
  Trash: [
    { id: 't1', name: 'Old Mockup.png', kind: 'image', variant: 9, size: '2.1 MB' },
    { id: 't2', name: 'Untitled.txt', kind: 'doc', size: '1 KB' },
  ],
  'Macintosh HD': [
    { id: 'hd1', name: 'Applications', kind: 'folder' },
    { id: 'hd2', name: 'Library', kind: 'folder' },
    { id: 'hd3', name: 'System', kind: 'folder' },
    { id: 'hd4', name: 'Users', kind: 'folder' },
  ],
  Pages: [],
  Numbers: [],
  Keynote: [],
  'Team Sync': [],
  Screenshots: [],
}

interface SidebarEntry {
  label: string
  path: string
  icon: React.ReactNode
  color?: string
}

const FAVORITES: SidebarEntry[] = [
  { label: 'AirDrop', path: 'AirDrop', icon: <Airplay className="h-[15px] w-[15px]" />, color: '#3f8ef7' },
  { label: 'Recents', path: 'Recents', icon: <Clock className="h-[15px] w-[15px]" />, color: '#6f7680' },
  { label: 'Applications', path: 'Applications', icon: <AppWindow className="h-[15px] w-[15px]" />, color: '#6f7680' },
  { label: 'Desktop', path: 'Desktop', icon: <Monitor className="h-[15px] w-[15px]" />, color: '#3f8ef7' },
  { label: 'Documents', path: 'Documents', icon: <FileText className="h-[15px] w-[15px]" />, color: '#3f8ef7' },
  { label: 'Downloads', path: 'Downloads', icon: <Download className="h-[15px] w-[15px]" />, color: '#3f8ef7' },
  { label: 'Pictures', path: 'Pictures', icon: <ImageIcon className="h-[15px] w-[15px]" />, color: '#3f8ef7' },
  { label: 'Music', path: 'Music', icon: <Music2 className="h-[15px] w-[15px]" />, color: '#f25c7a' },
  { label: 'Movies', path: 'Movies', icon: <Monitor className="h-[15px] w-[15px]" />, color: '#6f7680' },
]

const LOCATIONS: SidebarEntry[] = [
  { label: 'iCloud Drive', path: 'iCloud Drive', icon: <Cloud className="h-[15px] w-[15px]" />, color: '#3f8ef7' },
  { label: 'Shared', path: 'Shared', icon: <Users className="h-[15px] w-[15px]" />, color: '#6f7680' },
  { label: 'Macintosh HD', path: 'Macintosh HD', icon: <HardDrive className="h-[15px] w-[15px]" />, color: '#8b929c' },
]

const TAGS = [
  { name: 'Red', color: '#ff5f57' },
  { name: 'Orange', color: '#ff9f43' },
  { name: 'Green', color: '#3ed37b' },
  { name: 'Blue', color: '#4aa8ff' },
]

interface FinderAppProps {
  initialFolder?: string
  onOpenApp: (appId: AppId) => void
  onNewFolder?: () => void
}

export function FinderApp({ initialFolder = 'Recents', onOpenApp, onNewFolder }: FinderAppProps) {
  const start = initialFolder
  const [history, setHistory] = useState<string[]>([start])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState('')
  const [sortAsc, setSortAsc] = useState(true)

  const current = history[historyIndex]
  const rawItems = FS[current] ?? []
  const items = useMemo(() => {
    const filtered = rawItems.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
    return [...filtered].sort((a, b) => {
      const folderDiff = Number(b.kind === 'folder') - Number(a.kind === 'folder')
      if (folderDiff !== 0) return folderDiff
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    })
  }, [rawItems, query, sortAsc])

  const navigate = (path: string) => {
    if (!FS[path]) return
    const next = history.slice(0, historyIndex + 1)
    next.push(path)
    setHistory(next)
    setHistoryIndex(next.length - 1)
    setSelected(null)
    setQuery('')
  }

  const openItem = (item: FsItem) => {
    if (item.kind === 'folder') navigate(item.name)
    else if (item.kind === 'app' && item.appId) onOpenApp(item.appId)
  }

  const back = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setSelected(null)
    }
  }
  const forward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setSelected(null)
    }
  }

  const title = current === 'iCloud Drive' ? 'iCloud Drive' : current
  const isEmpty = items.length === 0

  return (
    <div className="flex h-full min-h-0 bg-[#fbfbfd] text-[#1d1d1f]">
      <aside className="hidden w-[172px] shrink-0 flex-col overflow-y-auto border-r border-black/[0.07] bg-[#eef0f3]/80 px-[8px] pb-3 pt-[9px] backdrop-blur-xl sm:flex">
        <SidebarSection label="Favorites">
          {FAVORITES.map((entry) => (
            <SidebarRow
              key={entry.path}
              active={current === entry.path}
              onClick={() => {
                if (FS[entry.path]) {
                  setHistory([entry.path])
                  setHistoryIndex(0)
                  setSelected(null)
                }
              }}
              icon={<span style={{ color: entry.color }}>{entry.icon}</span>}
              label={entry.label}
            />
          ))}
        </SidebarSection>
        <SidebarSection label="iCloud">
          {LOCATIONS.slice(0, 2).map((entry) => (
            <SidebarRow
              key={entry.path}
              active={current === entry.path}
              onClick={() => {
                setHistory([entry.path])
                setHistoryIndex(0)
                setSelected(null)
              }}
              icon={<span style={{ color: entry.color }}>{entry.icon}</span>}
              label={entry.label}
            />
          ))}
        </SidebarSection>
        <SidebarSection label="Locations">
          <SidebarRow
            active={current === 'Macintosh HD'}
            onClick={() => {
              setHistory(['Macintosh HD'])
              setHistoryIndex(0)
              setSelected(null)
            }}
            icon={<span className="text-[#8b929c]">{LOCATIONS[2].icon}</span>}
            label="Macintosh HD"
          />
          <SidebarRow
            active={current === 'Trash'}
            onClick={() => {
              setHistory(['Trash'])
              setHistoryIndex(0)
              setSelected(null)
            }}
            icon={<span className="text-[#8b929c]"><Trash2 className="h-[15px] w-[15px]" /></span>}
            label="Trash"
          />
        </SidebarSection>
        <SidebarSection label="Tags">
          {TAGS.map((tag) => (
            <div
              key={tag.name}
              className="flex h-[24px] items-center gap-[7px] rounded-[5px] px-[7px] text-[12px] hover:bg-black/[0.045]"
            >
              <span className="h-[9px] w-[9px] rounded-full" style={{ background: tag.color }} />
              <span>{tag.name}</span>
            </div>
          ))}
        </SidebarSection>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[44px] shrink-0 items-center gap-[10px] border-b border-black/[0.08] bg-[#f7f7f9]/85 px-[13px] backdrop-blur-xl">
          <div className="flex items-center gap-[2px]">
            <ToolbarIcon label="Back" onClick={back} disabled={historyIndex === 0}>
              <ArrowLeft className="h-[15px] w-[15px]" strokeWidth={2.1} />
            </ToolbarIcon>
            <ToolbarIcon label="Forward" onClick={forward} disabled={historyIndex >= history.length - 1}>
              <ArrowRight className="h-[15px] w-[15px]" strokeWidth={2.1} />
            </ToolbarIcon>
          </div>
          <div className="min-w-0 flex-1 truncate">
            <span className="text-[13px] font-semibold tracking-[-0.1px]">{title}</span>
            <span className="ml-[7px] text-[11.5px] text-black/40">
              {items.length} item{items.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="flex items-center rounded-[6px] border border-black/[0.08] bg-black/[0.035] p-[1.5px]">
            <ViewButton active={view === 'grid'} onClick={() => setView('grid')} label="Icons">
              <LayoutGrid className="h-[14px] w-[14px]" strokeWidth={2} />
            </ViewButton>
            <ViewButton active={view === 'list'} onClick={() => setView('list')} label="List">
              <List className="h-[14px] w-[14px]" strokeWidth={2} />
            </ViewButton>
          </div>

          <ToolbarIcon label="Sort" onClick={() => setSortAsc((v) => !v)}>
            <ArrowUpDown className="h-[14px] w-[14px]" strokeWidth={2.1} />
          </ToolbarIcon>

          <label className="hidden h-[26px] w-[148px] items-center gap-[5px] rounded-[6px] border border-black/[0.08] bg-white/70 px-[7px] focus-within:ring-2 focus-within:ring-[#0a84ff]/40 min-[780px]:flex">
            <Search className="h-[13px] w-[13px] shrink-0 text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-[11.5px] outline-none placeholder:text-black/35"
            />
          </label>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto p-[16px]"
          onClick={() => setSelected(null)}
          onContextMenu={(e) => e.preventDefault()}
        >
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center pb-6 text-center">
              <FolderIcon className="h-[68px] w-[68px] opacity-40 grayscale" />
              <p className="mt-3 text-[13px] font-medium text-black/55">Folder is Empty</p>
              <p className="mt-1 max-w-[260px] text-[11.5px] leading-[16px] text-black/35">
                Drag files here or use the File menu to add something new.
              </p>
              {onNewFolder && current === 'Desktop' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onNewFolder()
                  }}
                  className="mt-3 rounded-[6px] bg-[#0a84ff] px-[12px] py-[4px] text-[12px] font-medium text-white shadow-sm hover:brightness-110"
                >
                  New Folder
                </button>
              )}
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-x-[6px] gap-y-[16px]">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected(item.id)
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    openItem(item)
                  }}
                  className={`group flex flex-col items-center rounded-[7px] px-[4px] pb-[4px] pt-[5px] outline-none ${
                    selected === item.id ? 'bg-[#0a84ff]/15' : 'hover:bg-black/[0.035]'
                  }`}
                >
                  <ItemArt item={item} size={58} />
                  <span
                    className={`mt-[6px] line-clamp-2 max-w-full break-words rounded-[3px] px-[3px] text-center text-[11.5px] leading-[14px] ${
                      selected === item.id ? 'bg-[#0a84ff] text-white' : 'text-[#262629]'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[7px] border border-black/[0.07] bg-white/60">
              <div className="grid grid-cols-[minmax(0,1fr)_110px_110px_70px] border-b border-black/[0.07] bg-black/[0.025] px-[10px] py-[4px] text-[10.5px] font-medium text-black/40">
                <span>Name</span>
                <span className="hidden sm:block">Date Modified</span>
                <span className="hidden md:block">Kind</span>
                <span className="text-right">Size</span>
              </div>
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected(item.id)
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    openItem(item)
                  }}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_110px_110px_70px] items-center px-[10px] py-[5px] text-left text-[11.5px] ${
                    selected === item.id
                      ? 'bg-[#0a84ff] text-white'
                      : idx % 2
                        ? 'bg-black/[0.015] hover:bg-black/[0.035]'
                        : 'hover:bg-black/[0.03]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-[7px]">
                    <ItemArt item={item} size={17} bare />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className={`hidden truncate sm:block ${selected === item.id ? 'text-white/80' : 'text-black/45'}`}>
                    {item.modified ?? DEFAULT_MODIFIED}
                  </span>
                  <span className={`hidden truncate md:block ${selected === item.id ? 'text-white/80' : 'text-black/45'}`}>
                    {item.kind === 'folder' ? 'Folder' : item.kind === 'app' ? 'Application' : item.kind === 'image' ? 'Image' : item.kind === 'audio' ? 'Audio' : 'Document'}
                  </span>
                  <span className={`text-right ${selected === item.id ? 'text-white/80' : 'text-black/40'}`}>
                    {item.kind === 'folder' ? '—' : item.size ?? '—'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex h-[23px] shrink-0 items-center justify-between border-t border-black/[0.07] bg-[#f6f6f8] px-[13px] text-[10.5px] text-black/40">
          <span>
            {items.length} item{items.length === 1 ? '' : 's'}
            {selected ? `, 1 selected` : ''}
          </span>
          <span className="hidden sm:block">128.4 GB available</span>
        </div>
      </div>
    </div>
  )
}

function SidebarSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-[10px]">
      <div className="mb-[2px] px-[7px] text-[10.5px] font-semibold text-black/35">{label}</div>
      <div className="space-y-[1px]">{children}</div>
    </div>
  )
}

function SidebarRow({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[25px] w-full items-center gap-[7px] rounded-[5px] px-[7px] text-left text-[12px] tracking-[-0.05px] ${
        active ? 'bg-[#0a84ff] text-white' : 'text-[#2b2b2e] hover:bg-black/[0.05]'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
      {active && <ChevronRight className="ml-auto h-[11px] w-[11px] opacity-70" />}
    </button>
  )
}

function ToolbarIcon({
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
      className={`grid h-[26px] w-[27px] place-items-center rounded-[5px] ${
        disabled ? 'text-black/20' : 'text-black/55 hover:bg-black/[0.06] active:bg-black/10'
      }`}
    >
      {children}
    </button>
  )
}

function ViewButton({
  children,
  active,
  onClick,
  label,
}: {
  children: ReactNode
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`grid h-[22px] w-[26px] place-items-center rounded-[4px] ${
        active ? 'bg-white text-black/70 shadow-[0_1px_2px_rgba(0,0,0,0.15)]' : 'text-black/40 hover:text-black/60'
      }`}
    >
      {children}
    </button>
  )
}

function ItemArt({ item, size, bare }: { item: FsItem; size: number; bare?: boolean }) {
  const dimension = bare ? 17 : size
  let content: ReactNode

  if (item.kind === 'image') {
    content = (
      <PhotoArt
        variant={item.variant ?? 0}
        className={`h-full w-full ${bare ? 'rounded-[2px]' : 'rounded-[4px]'}`}
      />
    )
  } else if (item.kind === 'folder') {
    content = <FolderIcon className="h-full w-full" />
  } else if (item.kind === 'app' && item.appId) {
    const Glyph = APP_ICONS[item.appId]
    content = <Glyph className="h-full w-full" />
  } else if (item.kind === 'audio') {
    content = bare ? (
      <Music2 className="h-full w-full text-[#e02f46]" />
    ) : (
      <div className="grid h-full w-full place-items-center rounded-[6px] bg-gradient-to-b from-[#ff7b8a] to-[#e02f46] shadow-sm">
        <Music2 className="h-[26px] w-[26px] text-white" />
      </div>
    )
  } else {
    content = <FileIcon className="h-full w-full" />
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${
        bare ? '' : 'drop-shadow-[0_2px_3px_rgba(0,0,0,0.16)]'
      }`}
      style={{ width: dimension, height: dimension }}
    >
      {content}
    </div>
  )
}
