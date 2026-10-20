import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Image as ImageIcon,
  Info,
  MapPin,
  Play,
  Search,
  Share,
  SlidersHorizontal,
  Sparkles,
  Video,
  X,
} from 'lucide-react'
import { PhotoArt } from '../components/Artwork'

interface Photo {
  id: number
  variant: number
  title: string
  date: string
  location: string
  video?: boolean
  favorite?: boolean
}

const BASE_PHOTOS: Photo[] = [
  { id: 1, variant: 0, title: 'Big Sur Coast', date: 'October 18, 2026', location: 'Big Sur, California', favorite: true },
  { id: 2, variant: 1, title: 'Blue Hour', date: 'October 18, 2026', location: 'Monterey Bay, California' },
  { id: 3, variant: 2, title: 'Sunset Study', date: 'October 17, 2026', location: 'Santa Cruz, California', favorite: true },
  { id: 4, variant: 3, title: 'After the Rain', date: 'October 16, 2026', location: 'Portland, Oregon' },
  { id: 5, variant: 4, title: 'Forest Light', date: 'October 15, 2026', location: 'Olympic National Park' },
  { id: 6, variant: 5, title: 'Night Drive', date: 'October 14, 2026', location: 'Highway 1, California', video: true },
  { id: 7, variant: 6, title: 'Emerald Pool', date: 'October 12, 2026', location: 'Yosemite, California' },
  { id: 8, variant: 7, title: 'Warm Ridge', date: 'October 11, 2026', location: 'Sedona, Arizona', favorite: true },
  { id: 9, variant: 8, title: 'Violet Sky', date: 'October 9, 2026', location: 'Joshua Tree, California' },
  { id: 10, variant: 9, title: 'Golden Valley', date: 'October 7, 2026', location: 'Napa Valley, California' },
  { id: 11, variant: 10, title: 'Last Light', date: 'October 5, 2026', location: 'Malibu, California' },
  { id: 12, variant: 11, title: 'Coastal Fog', date: 'October 3, 2026', location: 'Half Moon Bay, California' },
  { id: 13, variant: 4, title: 'Pine Trail', date: 'September 29, 2026', location: 'Tahoe, California' },
  { id: 14, variant: 6, title: 'Still Water', date: 'September 27, 2026', location: 'Lake Tahoe, California', video: true },
  { id: 15, variant: 2, title: 'Desert Bloom', date: 'September 24, 2026', location: 'Palm Springs, California' },
  { id: 16, variant: 0, title: 'Pacific Morning', date: 'September 21, 2026', location: 'Big Sur, California' },
  { id: 17, variant: 9, title: 'Amber Fields', date: 'September 18, 2026', location: 'Sonoma, California', favorite: true },
  { id: 18, variant: 5, title: 'Twilight', date: 'September 14, 2026', location: 'San Francisco, California' },
  { id: 19, variant: 1, title: 'Misty Point', date: 'September 11, 2026', location: 'Mendocino, California' },
  { id: 20, variant: 8, title: 'Evening Glow', date: 'September 8, 2026', location: 'Monterey, California' },
  { id: 21, variant: 3, title: 'Quiet Harbor', date: 'September 4, 2026', location: 'Sausalito, California' },
  { id: 22, variant: 7, title: 'Red Rock', date: 'August 30, 2026', location: 'Moab, Utah', favorite: true },
  { id: 23, variant: 10, title: 'Heat Haze', date: 'August 26, 2026', location: 'Death Valley, California' },
  { id: 24, variant: 11, title: 'Open Road', date: 'August 22, 2026', location: 'Route 66, Arizona' },
]

const FILTERS = [
  { id: 'photos', label: 'Photos', icon: <ImageIcon className="h-[14px] w-[14px]" /> },
  { id: 'recents', label: 'Recents', icon: <Clock className="h-[14px] w-[14px]" /> },
  { id: 'favorites', label: 'Favorites', icon: <Heart className="h-[14px] w-[14px]" /> },
  { id: 'videos', label: 'Videos', icon: <Video className="h-[14px] w-[14px]" /> },
  { id: 'memories', label: 'Memories', icon: <Sparkles className="h-[14px] w-[14px]" /> },
] as const

type FilterId = (typeof FILTERS)[number]['id']

export function PhotosApp() {
  const [filter, setFilter] = useState<FilterId>('photos')
  const [mode, setMode] = useState<'Years' | 'Months' | 'Days' | 'All Photos'>('All Photos')
  const [favorites, setFavorites] = useState<Set<number>>(
    () => new Set(BASE_PHOTOS.filter((p) => p.favorite).map((p) => p.id)),
  )
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [density, setDensity] = useState(48)

  const photos = useMemo(() => {
    let list = BASE_PHOTOS
    if (filter === 'favorites') list = list.filter((p) => favorites.has(p.id))
    else if (filter === 'videos') list = list.filter((p) => p.video)
    else if (filter === 'memories') list = list.filter((p) => p.variant % 3 === 0)
    return list
  }, [filter, favorites])

  useEffect(() => {
    setOpenIndex(null)
  }, [filter, mode])

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : Math.min(photos.length - 1, i + 1)))
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? i : Math.max(0, i - 1)))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openIndex, photos.length])

  const columns =
    mode === 'Years' ? 'repeat(auto-fill,minmax(240px,1fr))' : mode === 'Months' ? 'repeat(auto-fill,minmax(180px,1fr))' : mode === 'Days' ? 'repeat(auto-fill,minmax(130px,1fr))' : `repeat(auto-fill, minmax(${Math.round(170 - density)}px, 1fr))`

  const activePhoto = openIndex !== null ? photos[openIndex] : null

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="relative flex h-full min-h-0 bg-white text-[#1d1d1f]">
      <aside className="hidden w-[190px] shrink-0 flex-col overflow-y-auto border-r border-black/[0.07] bg-[#f2f3f5]/85 px-[8px] pb-4 pt-[10px] backdrop-blur-xl sm:flex">
        <div className="mb-[12px] flex items-center gap-[7px] px-[8px]">
          <span className="text-[12.5px] font-bold tracking-[-0.1px] text-[#1d1d1f]">Photos</span>
        </div>
        <div className="mb-[4px] px-[8px] text-[10px] font-semibold text-black/35">Library</div>
        {FILTERS.slice(0, 5).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex h-[25px] items-center gap-[7px] rounded-[5px] px-[8px] text-[11.5px] ${
              filter === f.id ? 'bg-[#0a84ff] text-white' : 'text-[#3c3c3f] hover:bg-black/[0.05]'
            }`}
          >
            <span className={filter === f.id ? 'text-white' : 'text-[#0a84ff]'}>{f.icon}</span>
            {f.label}
          </button>
        ))}
        <div className="mb-[4px] mt-[14px] px-[8px] text-[10px] font-semibold text-black/35">Albums</div>
        {[
          { name: 'Big Sur', variant: 0 },
          { name: 'Travel', variant: 4 },
          { name: 'Family', variant: 2 },
          { name: 'Screenshots', variant: 9 },
        ].map((a) => (
          <button
            key={a.name}
            onClick={() => setFilter('photos')}
            className="flex h-[26px] items-center gap-[8px] rounded-[5px] px-[8px] text-[11.5px] text-[#3c3c3f] hover:bg-black/[0.05]"
          >
            <PhotoArt variant={a.variant} className="h-[17px] w-[17px] rounded-[3px]" />
            {a.name}
          </button>
        ))}
        <div className="mb-[4px] mt-[14px] px-[8px] text-[10px] font-semibold text-black/35">Media Types</div>
        {['Panoramas', 'Live Photos', 'Portraits', 'Time-lapse'].map((m) => (
          <button
            key={m}
            className="flex h-[26px] items-center gap-[8px] rounded-[5px] px-[8px] text-[11.5px] text-[#3c3c3f] hover:bg-black/[0.05]"
          >
            <Video className="h-[13px] w-[13px] text-black/35" />
            {m}
          </button>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[50px] shrink-0 items-center gap-[12px] border-b border-black/[0.07] bg-[#fbfbfd]/90 px-[16px] backdrop-blur-xl">
          <h1 className="text-[16px] font-bold tracking-[-0.35px]">
            {filter === 'photos' ? 'Library' : FILTERS.find((f) => f.id === filter)?.label}
          </h1>
          <div className="mx-auto hidden items-center rounded-[7px] border border-black/[0.08] bg-black/[0.045] p-[2px] sm:flex">
            {(['Years', 'Months', 'Days', 'All Photos'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-[5px] px-[11px] py-[3px] text-[11px] font-medium transition-colors ${
                  mode === m ? 'bg-white text-black/80 shadow-[0_1px_2px_rgba(0,0,0,0.14)]' : 'text-black/45 hover:text-black/65'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-[2px] text-black/50">
            <IconButton label="Search"><Search className="h-[14px] w-[14px]" /></IconButton>
            <div className="hidden items-center gap-[6px] px-[6px] md:flex">
              <SlidersHorizontal className="h-[12px] w-[12px] text-black/30" />
              <input
                type="range"
                min={10}
                max={70}
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
                aria-label="Thumbnail size"
                className="h-[3px] w-[64px] cursor-pointer appearance-none rounded-full bg-black/15 accent-[#0a84ff]"
              />
            </div>
            <IconButton label="Share"><Share className="h-[14px] w-[14px]" /></IconButton>
            <IconButton label="Info"><Info className="h-[14px] w-[14px]" /></IconButton>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[10px] pb-6 pt-[12px]">
          <div className="mb-[10px] flex items-end justify-between px-[4px]">
            <div>
              <p className="text-[11px] font-semibold text-black/45">{mode === 'All Photos' ? 'All Photos' : mode}</p>
              <p className="mt-[1px] text-[10px] text-black/30">
                {photos.length} photos · {filter === 'favorites' ? 'Favorite moments' : 'California, 2026'}
              </p>
            </div>
            <button className="text-[10.5px] font-medium text-[#0a84ff] hover:underline">Select</button>
          </div>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: columns }}>
            {photos.map((p, i) => (
              <motion.button
                key={p.id}
                layout
                onClick={() => setOpenIndex(i)}
                className="group relative aspect-square overflow-hidden rounded-[3px] bg-black/5 outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]"
                whileHover={{ scale: 1.012 }}
                transition={{ duration: 0.16, ease: [0.32, 0.72, 0, 1] }}
              >
                <PhotoArt
                  variant={p.variant}
                  className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.03] ${
                    mode === 'Years' ? 'aspect-[4/3]' : ''
                  }`}
                />
                <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/[0.06]" />
                {p.video && (
                  <span className="absolute bottom-[5px] left-[5px] flex items-center gap-[3px] rounded-[4px] bg-black/45 px-[4px] py-[1px] text-[8px] font-medium text-white backdrop-blur-sm">
                    <Play className="h-[7px] w-[7px]" fill="currentColor" /> 0:14
                  </span>
                )}
                {favorites.has(p.id) && (
                  <Heart className="absolute bottom-[5px] right-[5px] h-[11px] w-[11px] text-white/90 drop-shadow" fill="currentColor" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activePhoto && openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-30 flex flex-col bg-[#101013]/95 text-white"
            onClick={() => setOpenIndex(null)}
          >
            <div className="flex h-[42px] shrink-0 items-center justify-between px-[14px]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-[4px]">
                <button
                  onClick={() => setOpenIndex(null)}
                  aria-label="Close"
                  className="grid h-[26px] w-[26px] place-items-center rounded-full bg-white/10 hover:bg-white/20"
                >
                  <X className="h-[14px] w-[14px]" />
                </button>
                <span className="ml-[6px] text-[11px] text-white/55">{activePhoto.date}</span>
              </div>
              <div className="flex items-center gap-[4px]">
                <button
                  onClick={() => toggleFavorite(activePhoto.id)}
                  aria-label="Favorite"
                  className="grid h-[26px] w-[26px] place-items-center rounded-full hover:bg-white/10"
                >
                  <Heart className={`h-[14px] w-[14px] ${favorites.has(activePhoto.id) ? 'text-[#ff5f7a]' : 'text-white/75'}`} fill={favorites.has(activePhoto.id) ? 'currentColor' : 'none'} />
                </button>
                <button aria-label="Share" className="grid h-[26px] w-[26px] place-items-center rounded-full hover:bg-white/10">
                  <Share className="h-[14px] w-[14px] text-white/75" />
                </button>
                <button aria-label="Info" className="grid h-[26px] w-[26px] place-items-center rounded-full hover:bg-white/10">
                  <Info className="h-[14px] w-[14px] text-white/75" />
                </button>
              </div>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-[52px] pb-[52px]">
              <button
                onClick={(e) => { e.stopPropagation(); setOpenIndex(Math.max(0, openIndex - 1)) }}
                disabled={openIndex === 0}
                aria-label="Previous photo"
                className="absolute left-[12px] z-10 grid h-[32px] w-[32px] place-items-center rounded-full bg-black/35 text-white/80 backdrop-blur-sm hover:bg-black/55 disabled:opacity-25"
              >
                <ChevronLeft className="h-[19px] w-[19px]" />
              </button>
              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                className="flex h-full w-full items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <PhotoArt variant={activePhoto.variant} className="max-h-full max-w-full rounded-[4px] shadow-[0_20px_70px_rgba(0,0,0,0.6)]" />
              </motion.div>
              <button
                onClick={(e) => { e.stopPropagation(); setOpenIndex(Math.min(photos.length - 1, openIndex + 1)) }}
                disabled={openIndex === photos.length - 1}
                aria-label="Next photo"
                className="absolute right-[12px] z-10 grid h-[32px] w-[32px] place-items-center rounded-full bg-black/35 text-white/80 backdrop-blur-sm hover:bg-black/55 disabled:opacity-25"
              >
                <ChevronRight className="h-[19px] w-[19px]" />
              </button>
            </div>
            <div className="flex h-[54px] shrink-0 items-center justify-center gap-[14px] border-t border-white/10 text-[10.5px] text-white/50">
              <span className="font-medium text-white/80">{activePhoto.title}</span>
              <span className="flex items-center gap-[4px]">
                <MapPin className="h-[10px] w-[10px]" /> {activePhoto.location}
              </span>
              <span>{activePhoto.date}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function IconButton({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="grid h-[25px] w-[26px] place-items-center rounded-[5px] hover:bg-black/[0.06] active:bg-black/10"
    >
      {children}
    </button>
  )
}
