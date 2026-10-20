import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Compass,
  Heart,
  Inbox,
  Mail,
  MapPin,
  MessageSquare,
  Mic,
  MicOff,
  MoreHorizontal,
  Paperclip,
  Pause,
  Phone,
  Play,
  Plus,
  Radio,
  Repeat,
  Search,
  Send,
  Settings2,
  Share,
  Shuffle,
  SkipBack,
  SkipForward,
  Star,
  Trash2,
  Users,
  Video,
  VideoOff,
  Volume2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { PhotoArt } from '../components/Artwork'
import { TRACKS, AlbumArt } from '../components/ControlCenter'
import { APP_ICONS } from '../components/AppIcons'

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#ff9a6b,#ff5f7a)',
  'linear-gradient(135deg,#6f8cff,#a06bff)',
  'linear-gradient(135deg,#43d6a5,#2b8fd8)',
  'linear-gradient(135deg,#ffd166,#ff8f4f)',
  'linear-gradient(135deg,#e46bff,#7b4bff)',
  'linear-gradient(135deg,#59c6f5,#3178e8)',
]

function Avatar({ name, size = 32, index = 0 }: { name: string; size?: number; index?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(8, size * 0.34),
        background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
        boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.3)',
      }}
    >
      {initials}
    </span>
  )
}

function AppSidebar({ children, width = 210 }: { children: ReactNode; width?: number }) {
  return (
    <aside
      className="hidden shrink-0 flex-col overflow-y-auto border-r border-black/[0.07] bg-[#f2f3f5]/85 px-[8px] pb-4 pt-[10px] backdrop-blur-xl md:flex"
      style={{ width }}
    >
      {children}
    </aside>
  )
}

/* ---------------------------------- Messages --------------------------------- */

interface Message {
  from: 'me' | 'them'
  text: string
  time: string
}

interface Thread {
  id: string
  name: string
  preview: string
  time: string
  unread?: boolean
  messages: Message[]
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 't1',
    name: 'Ana Rivera',
    preview: 'The new dock feels so natural.',
    time: '9:41 AM',
    unread: true,
    messages: [
      { from: 'them', text: 'Hey! Did you try the new build?', time: '9:38 AM' },
      { from: 'me', text: 'Just opened it. The dock magnification is spot on.', time: '9:39 AM' },
      { from: 'them', text: 'Right? It actually settles like the real thing.', time: '9:40 AM' },
      { from: 'them', text: 'The new dock feels so natural.', time: '9:41 AM' },
    ],
  },
  {
    id: 't2',
    name: 'Design Team',
    preview: 'Sam: pushing the final icons now',
    time: '9:12 AM',
    unread: true,
    messages: [
      { from: 'them', text: 'Morning everyone — final icon pass is in Figma.', time: '9:05 AM' },
      { from: 'me', text: 'Looks great. The Photos icon especially.', time: '9:08 AM' },
      { from: 'them', text: 'Sam: pushing the final icons now', time: '9:12 AM' },
    ],
  },
  {
    id: 't3',
    name: 'Noah Kim',
    preview: 'Dinner on Friday?',
    time: 'Yesterday',
    messages: [
      { from: 'them', text: 'Dinner on Friday?', time: 'Yesterday' },
      { from: 'me', text: 'Yes — that little place on Valencia?', time: 'Yesterday' },
      { from: 'them', text: 'Perfect. 7:30.', time: 'Yesterday' },
    ],
  },
  {
    id: 't4',
    name: 'Maya Chen',
    preview: 'Sent you the wallpaper pack',
    time: 'Monday',
    messages: [{ from: 'them', text: 'Sent you the wallpaper pack', time: 'Monday' }],
  },
]

const REPLIES = [
  'That makes sense — let’s go with it.',
  'Nice, I’ll take a look after lunch.',
  'Agreed. The motion feels much smoother now.',
  'Sounds good! Talk soon.',
]

export function MessagesApp() {
  const [threads, setThreads] = useState(INITIAL_THREADS)
  const [selectedId, setSelectedId] = useState('t1')
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const selected = threads.find((t) => t.id === selectedId) ?? threads[0]

  useEffect(() => {
    setThreads((prev) => prev.map((t) => (t.id === selectedId ? { ...t, unread: false } : t)))
  }, [selectedId])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [selected?.messages.length, selectedId])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? {
              ...t,
              preview: text,
              time: 'now',
              messages: [
                ...t.messages,
                { from: 'me', text, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) },
              ],
            }
          : t,
      ),
    )
    const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)]
    window.setTimeout(() => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === selectedId
            ? {
                ...t,
                preview: reply,
                time: 'now',
                messages: [
                  ...t.messages,
                  { from: 'them', text: reply, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) },
                ],
              }
            : t,
        ),
      )
    }, 1400)
  }

  const filtered = threads.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex h-full min-h-0 bg-white">
      <AppSidebar width={236}>
        <div className="mb-[8px] flex items-center justify-between px-[7px]">
          <span className="text-[13px] font-bold tracking-[-0.2px]">Messages</span>
          <button className="grid h-[20px] w-[20px] place-items-center rounded-[5px] text-[#0a84ff] hover:bg-black/[0.06]" aria-label="New message">
            <Plus className="h-[15px] w-[15px]" strokeWidth={2.3} />
          </button>
        </div>
        <label className="mb-[8px] flex h-[24px] items-center gap-[5px] rounded-[6px] border border-black/[0.08] bg-white/60 px-[6px]">
          <Search className="h-[11px] w-[11px] text-black/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[11px] outline-none placeholder:text-black/35"
          />
        </label>
        <div className="space-y-[1px]">
          {filtered.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={`flex w-full items-start gap-[8px] rounded-[6px] px-[7px] py-[6px] text-left ${
                selectedId === t.id ? 'bg-[#0a84ff] text-white' : 'hover:bg-black/[0.04]'
              }`}
            >
              <Avatar name={t.name} size={27} index={i} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-[5px]">
                  <span className="truncate text-[11.5px] font-semibold">{t.name}</span>
                  <span className={`ml-auto shrink-0 text-[8.5px] ${selectedId === t.id ? 'text-white/65' : 'text-black/35'}`}>
                    {t.time}
                  </span>
                </div>
                <div className={`mt-[1px] flex items-center gap-[4px] text-[10px] ${selectedId === t.id ? 'text-white/75' : 'text-black/45'}`}>
                  <span className="truncate">{t.preview}</span>
                  {t.unread && selectedId !== t.id && <span className="ml-auto h-[6px] w-[6px] shrink-0 rounded-full bg-[#0a84ff]" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </AppSidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[44px] shrink-0 items-center gap-[8px] border-b border-black/[0.07] bg-[#fbfbfd] px-[12px]">
          <Avatar name={selected.name} size={24} index={threads.findIndex((t) => t.id === selected.id)} />
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold">{selected.name}</p>
            <p className="text-[9px] text-black/35">iMessage</p>
          </div>
          <div className="ml-auto flex items-center gap-[2px] text-[#0a84ff]">
            <button className="grid h-[24px] w-[24px] place-items-center rounded-[5px] hover:bg-black/[0.05]" aria-label="FaceTime">
              <Video className="h-[14px] w-[14px]" />
            </button>
            <button className="grid h-[24px] w-[24px] place-items-center rounded-[5px] hover:bg-black/[0.05]" aria-label="Info">
              <Circle className="h-[14px] w-[14px]" />
            </button>
          </div>
        </div>

        <div ref={bodyRef} className="min-h-0 flex-1 space-y-[6px] overflow-y-auto bg-white px-[16px] py-[12px]">
          <p className="mb-2 text-center text-[9.5px] text-black/30">Today</p>
          {selected.messages.map((m, i) => (
            <motion.div
              key={`${selected.id}-${i}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
              className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[72%] rounded-[15px] px-[11px] py-[5px] text-[11.5px] leading-[16px] ${
                  m.from === 'me'
                    ? 'rounded-br-[5px] bg-[#0a84ff] text-white'
                    : 'rounded-bl-[5px] bg-[#e9e9eb] text-[#1d1d1f]'
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex h-[42px] shrink-0 items-center gap-[6px] border-t border-black/[0.07] bg-[#f7f7f9] px-[10px]">
          <button className="grid h-[24px] w-[24px] place-items-center rounded-full text-[#0a84ff] hover:bg-black/[0.05]" aria-label="Attach">
            <Plus className="h-[16px] w-[16px]" />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="iMessage"
            className="h-[26px] flex-1 rounded-full border border-black/[0.1] bg-white px-[10px] text-[11px] outline-none focus:ring-2 focus:ring-[#0a84ff]/30"
          />
          <button
            onClick={send}
            aria-label="Send"
            disabled={!draft.trim()}
            className={`grid h-[24px] w-[24px] place-items-center rounded-full ${
              draft.trim() ? 'bg-[#0a84ff] text-white' : 'bg-black/[0.08] text-black/25'
            }`}
          >
            <Send className="h-[12px] w-[12px]" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------- Music ---------------------------------- */

export interface MusicProps {
  trackIndex: number
  playing: boolean
  onTogglePlay: () => void
  onNext: () => void
  onPrev: () => void
  onSelectTrack: (i: number) => void
}

export function MusicApp({ trackIndex, playing, onTogglePlay, onNext, onPrev, onSelectTrack }: MusicProps) {
  const track = TRACKS[trackIndex % TRACKS.length]
  const [section, setSection] = useState('Listen Now')

  return (
    <div className="flex h-full min-h-0 bg-[#fbfbfd]">
      <AppSidebar width={176}>
        <div className="mb-[12px] px-[8px] text-[13px] font-bold tracking-[-0.2px]">Music</div>
        {[
          { label: 'Listen Now', icon: <Play className="h-[13px] w-[13px]" /> },
          { label: 'Browse', icon: <Compass className="h-[13px] w-[13px]" /> },
          { label: 'Radio', icon: <Radio className="h-[13px] w-[13px]" /> },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setSection(s.label)}
            className={`flex h-[25px] w-full items-center gap-[7px] rounded-[5px] px-[8px] text-[11.5px] ${
              section === s.label ? 'bg-black/[0.07] font-medium' : 'text-[#3a3a3c] hover:bg-black/[0.04]'
            }`}
          >
            <span className="text-[#fa2d48]">{s.icon}</span>
            {s.label}
          </button>
        ))}
        <div className="mb-[4px] mt-[14px] px-[8px] text-[10px] font-semibold text-black/35">Library</div>
        {['Recently Added', 'Artists', 'Albums', 'Songs'].map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`flex h-[25px] w-full items-center rounded-[5px] px-[8px] text-[11.5px] ${
              section === s ? 'bg-black/[0.07] font-medium' : 'text-[#3a3a3c] hover:bg-black/[0.04]'
            }`}
          >
            {s}
          </button>
        ))}
        <div className="mb-[4px] mt-[14px] px-[8px] text-[10px] font-semibold text-black/35">Playlists</div>
        {['Big Sur Drive', 'Late Night', 'Focus'].map((s) => (
          <button key={s} className="flex h-[25px] w-full items-center rounded-[5px] px-[8px] text-[11.5px] text-[#3a3a3c] hover:bg-black/[0.04]">
            {s}
          </button>
        ))}
      </AppSidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[44px] shrink-0 items-center justify-between border-b border-black/[0.07] bg-[#fbfbfd] px-[16px]">
          <span className="text-[12px] font-semibold">{section}</span>
          <div className="flex items-center gap-[6px] text-black/40">
            <Search className="h-[13px] w-[13px]" />
            <span className="text-[10px]">Search</span>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-[18px]">
          <div className="flex flex-col gap-[18px] rounded-[12px] border border-black/[0.06] bg-white p-[16px] shadow-sm sm:flex-row">
            <div className="relative mx-auto w-[180px] shrink-0 sm:mx-0">
              <AlbumArt
                variant={track.art}
                className="aspect-square w-full rounded-[9px] shadow-[0_14px_34px_rgba(0,0,0,0.24)]"
              />
              <span className="absolute bottom-2 left-2 rounded-[4px] bg-black/50 px-[5px] py-[1px] text-[8px] font-medium text-white backdrop-blur">
                {playing ? 'PLAYING' : 'PAUSED'}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#fa2d48]">Now Playing</p>
              <h2 className="mt-[5px] text-[20px] font-bold leading-[24px] tracking-[-0.5px]">{track.title}</h2>
              <p className="mt-[2px] text-[12px] text-black/45">{track.artist} — {track.album}</p>
              <div className="mt-[14px]">
                <div className="h-[3px] overflow-hidden rounded-full bg-black/10">
                  <div className="h-full rounded-full bg-[#fa2d48]" style={{ width: playing ? '38%' : '12%' }} />
                </div>
                <div className="mt-[4px] flex justify-between text-[8.5px] text-black/30">
                  <span>1:32</span>
                  <span>-2:01</span>
                </div>
              </div>
              <div className="mt-[10px] flex items-center gap-[12px]">
                <button className="text-black/35 hover:text-black/60" aria-label="Shuffle">
                  <Shuffle className="h-[13px] w-[13px]" />
                </button>
                <button onClick={onPrev} className="text-black/55 hover:text-black" aria-label="Previous">
                  <SkipBack className="h-[17px] w-[17px]" fill="currentColor" />
                </button>
                <button
                  onClick={onTogglePlay}
                  aria-label={playing ? 'Pause' : 'Play'}
                  className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#fa2d48] text-white shadow-[0_3px_10px_rgba(250,45,72,0.35)] hover:brightness-110 active:scale-95"
                >
                  {playing ? <Pause className="h-[16px] w-[16px]" fill="currentColor" strokeWidth={1} /> : <Play className="ml-[1px] h-[16px] w-[16px]" fill="currentColor" strokeWidth={1} />}
                </button>
                <button onClick={onNext} className="text-black/55 hover:text-black" aria-label="Next">
                  <SkipForward className="h-[17px] w-[17px]" fill="currentColor" />
                </button>
                <button className="ml-1 text-black/35 hover:text-black/60" aria-label="Repeat">
                  <Repeat className="h-[13px] w-[13px]" />
                </button>
                <Volume2 className="ml-auto h-[13px] w-[13px] text-black/35" />
              </div>
            </div>
          </div>

          <h3 className="mb-[8px] mt-[20px] text-[12px] font-semibold">Up Next</h3>
          <div className="overflow-hidden rounded-[10px] border border-black/[0.06] bg-white">
            {TRACKS.map((t, i) => (
              <button
                key={t.title}
                onClick={() => onSelectTrack(i)}
                className={`flex w-full items-center gap-[10px] px-[12px] py-[8px] text-left ${
                  i === trackIndex ? 'bg-[#fa2d48]/[0.07]' : 'hover:bg-black/[0.025]'
                } ${i < TRACKS.length - 1 ? 'border-b border-black/[0.05]' : ''}`}
              >
                <AlbumArt variant={t.art} className="h-[32px] w-[32px] shrink-0 rounded-[4px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium">{t.title}</p>
                  <p className="truncate text-[9.5px] text-black/40">{t.artist}</p>
                </div>
                <span className="text-[9px] tabular-nums text-black/30">
                  {Math.floor(t.duration / 60)}:{String(t.duration % 60).padStart(2, '0')}
                </span>
                {i === trackIndex && playing && <span className="h-[8px] w-[8px] rounded-full bg-[#fa2d48]" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Reminders -------------------------------- */

interface Reminder {
  id: number
  title: string
  list: string
  done: boolean
  due?: string
  flag?: boolean
}

const INITIAL_REMINDERS: Reminder[] = [
  { id: 1, title: 'Finish dock magnification pass', list: 'Work', done: false, due: 'Today', flag: true },
  { id: 2, title: 'Review Control Center blur values', list: 'Work', done: false, due: 'Today' },
  { id: 3, title: 'Order new wallpaper prints', list: 'Personal', done: false, due: 'Tomorrow' },
  { id: 4, title: 'Book the Big Sur cabin', list: 'Personal', done: true },
  { id: 5, title: 'Send the final icon set', list: 'Work', done: true },
  { id: 6, title: 'Pick up coffee beans', list: 'Errands', done: false },
]

export function RemindersApp() {
  const [reminders, setReminders] = useState(INITIAL_REMINDERS)
  const [list, setList] = useState('Today')
  const [draft, setDraft] = useState('')

  const lists = ['Today', 'Upcoming', 'All', 'Work', 'Personal', 'Errands']
  const visibleList = list === 'Today' ? 'All' : list
  const visible = reminders.filter((r) => {
    if (list === 'Today') return !r.done && r.due === 'Today'
    if (list === 'Upcoming') return !r.done && !!r.due
    if (list === 'All') return true
    return r.list === visibleList
  })

  const add = () => {
    if (!draft.trim()) return
    setReminders((prev) => [
      ...prev,
      { id: Date.now(), title: draft.trim(), list: list === 'Today' || list === 'All' ? 'Personal' : list, done: false },
    ])
    setDraft('')
  }

  const toggle = (id: number) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)))

  return (
    <div className="flex h-full min-h-0 bg-white">
      <div className="hidden w-[190px] shrink-0 flex-col border-r border-black/[0.07] bg-[#f2f3f5]/85 px-[8px] pb-3 pt-[10px] sm:flex">
        <div className="mb-[10px] flex items-center justify-between px-[7px]">
          <span className="text-[13px] font-bold">Reminders</span>
          <button className="grid h-[20px] w-[20px] place-items-center rounded-[5px] text-[#0a84ff] hover:bg-black/[0.06]" aria-label="New list">
            <Plus className="h-[14px] w-[14px]" />
          </button>
        </div>
        {lists.slice(0, 3).map((l, i) => (
          <button
            key={l}
            onClick={() => setList(l)}
            className={`flex h-[26px] items-center gap-[7px] rounded-[5px] px-[7px] text-[11.5px] ${
              list === l ? 'bg-[#0a84ff] text-white' : 'text-[#3a3a3c] hover:bg-black/[0.04]'
            }`}
          >
            <span className={`grid h-[17px] w-[17px] place-items-center rounded-[5px] ${list === l ? 'bg-white/20' : 'bg-[#0a84ff]'}`}>
              {i === 0 ? <CalendarDays className="h-[10px] w-[10px] text-white" /> : i === 1 ? <Clock className="h-[10px] w-[10px] text-white" /> : <Inbox className="h-[10px] w-[10px] text-white" />}
            </span>
            {l}
          </button>
        ))}
        <div className="mb-[4px] mt-[16px] px-[7px] text-[10px] font-semibold text-black/35">My Lists</div>
        {['Work', 'Personal', 'Errands'].map((l, i) => (
          <button
            key={l}
            onClick={() => setList(l)}
            className={`flex h-[26px] items-center gap-[7px] rounded-[5px] px-[7px] text-[11.5px] ${
              list === l ? 'bg-[#0a84ff] text-white' : 'text-[#3a3a3c] hover:bg-black/[0.04]'
            }`}
          >
            <span className="h-[9px] w-[9px] rounded-full" style={{ background: ['#0a84ff', '#ff9f43', '#3ed37b'][i] }} />
            <span className="flex-1 text-left">{l}</span>
            <span className={`text-[9.5px] ${list === l ? 'text-white/60' : 'text-black/30'}`}>
              {reminders.filter((r) => r.list === l && !r.done).length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[46px] shrink-0 items-center justify-between border-b border-black/[0.07] px-[18px]">
          <div>
            <h1 className="text-[16px] font-bold tracking-[-0.3px]" style={{ color: list === 'Today' ? '#0a84ff' : list === 'Work' ? '#0a84ff' : list === 'Personal' ? '#ff9f43' : '#1d1d1f' }}>
              {list}
            </h1>
            <p className="text-[9.5px] text-black/35">{visible.filter((r) => !r.done).length} remaining</p>
          </div>
          <div className="flex items-center gap-[7px] text-black/35">
            <Search className="h-[13px] w-[13px]" />
            <MoreHorizontal className="h-[15px] w-[15px]" />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-[18px] py-[8px]">
          {visible.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-black/25">
              <Check className="h-[30px] w-[30px]" strokeWidth={1.2} />
              <p className="text-[12px]">All caught up</p>
            </div>
          )}
          {visible.map((r) => (
            <div key={r.id} className="group flex items-start gap-[9px] border-b border-black/[0.06] py-[9px]">
              <button
                onClick={() => toggle(r.id)}
                aria-label={r.done ? 'Mark incomplete' : 'Mark complete'}
                className={`mt-[1px] grid h-[16px] w-[16px] shrink-0 place-items-center rounded-full border ${
                  r.done ? 'border-[#0a84ff] bg-[#0a84ff]' : 'border-black/20 hover:border-[#0a84ff]'
                }`}
              >
                {r.done && <Check className="h-[10px] w-[10px] text-white" strokeWidth={3.2} />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`text-[11.5px] leading-[15px] ${r.done ? 'text-black/30 line-through' : 'text-[#2b2b2e]'}`}>{r.title}</p>
                <div className="mt-[2px] flex items-center gap-[6px] text-[9px]">
                  <span className="rounded-[3px] px-[4px] py-[1px] text-white" style={{ background: r.list === 'Work' ? '#0a84ff' : r.list === 'Personal' ? '#ff9f43' : '#3ed37b' }}>
                    {r.list}
                  </span>
                  {r.due && <span className="text-black/35">{r.due}</span>}
                  {r.flag && <span className="text-[#ff9f43]">●</span>}
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100" aria-label="More">
                <MoreHorizontal className="h-[14px] w-[14px] text-black/30" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex h-[40px] shrink-0 items-center gap-[7px] border-t border-black/[0.07] px-[16px]">
          <Plus className="h-[14px] w-[14px] text-[#0a84ff]" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="New Reminder"
            className="flex-1 bg-transparent text-[11.5px] outline-none placeholder:text-black/30"
          />
          {draft && (
            <button onClick={add} className="text-[10.5px] font-medium text-[#0a84ff]">
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------- Maps ----------------------------------- */

const PLACES = [
  { id: 'p1', name: 'Bixby Creek Bridge', area: 'Big Sur, CA', x: 268, y: 214, color: '#ff5f57' },
  { id: 'p2', name: 'Pfeiffer Beach', area: 'Big Sur, CA', x: 214, y: 300, color: '#ff9f43' },
  { id: 'p3', name: 'Nepenthe', area: 'Big Sur, CA', x: 300, y: 262, color: '#0a84ff' },
  { id: 'p4', name: 'Monterey Bay Aquarium', area: 'Monterey, CA', x: 422, y: 140, color: '#0a84ff' },
  { id: 'p5', name: 'Carmel Beach', area: 'Carmel, CA', x: 470, y: 205, color: '#3ed37b' },
]

export function MapsApp() {
  const [selected, setSelected] = useState(PLACES[0])
  const [query, setQuery] = useState('')
  const [zoom, setZoom] = useState(1)
  const [saved, setSaved] = useState(false)

  const results = PLACES.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.area.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="flex h-full min-h-0 bg-[#f4f3ef]">
      <div className="hidden w-[224px] shrink-0 flex-col border-r border-black/[0.08] bg-[#f7f7f5]/90 backdrop-blur-xl sm:flex">
        <div className="p-[10px]">
          <p className="px-[4px] text-[13px] font-bold">Maps</p>
          <label className="mt-[8px] flex h-[27px] items-center gap-[6px] rounded-[7px] border border-black/[0.1] bg-white px-[8px] shadow-sm">
            <Search className="h-[12px] w-[12px] text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Maps"
              className="w-full bg-transparent text-[11px] outline-none placeholder:text-black/35"
            />
          </label>
        </div>
        <div className="grid grid-cols-4 gap-[4px] px-[12px] pb-[12px]">
          {[
            { icon: <Compass className="h-[13px] w-[13px]" />, color: '#0a84ff', label: 'Explore' },
            { icon: <MapPin className="h-[13px] w-[13px]" />, color: '#ff5f57', label: 'Nearby' },
            { icon: <Star className="h-[13px] w-[13px]" />, color: '#ff9f43', label: 'Guides' },
            { icon: <Clock className="h-[13px] w-[13px]" />, color: '#3ed37b', label: 'History' },
          ].map((c) => (
            <button key={c.label} className="flex flex-col items-center gap-[3px] rounded-[6px] py-[5px] hover:bg-black/[0.04]">
              <span className="grid h-[24px] w-[24px] place-items-center rounded-full text-white" style={{ background: c.color }}>
                {c.icon}
              </span>
              <span className="text-[8px] text-black/50">{c.label}</span>
            </button>
          ))}
        </div>
        <div className="border-t border-black/[0.07] px-[12px] pt-[9px] text-[10px] font-semibold text-black/40">
          {query ? `Results for “${query}”` : 'Favorites'}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-[7px] py-[5px]">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelected(p); setSaved(false) }}
              className={`flex w-full items-start gap-[8px] rounded-[6px] px-[7px] py-[7px] text-left ${
                selected.id === p.id ? 'bg-[#0a84ff] text-white' : 'hover:bg-black/[0.04]'
              }`}
            >
              <span className="mt-[2px] grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full" style={{ background: selected.id === p.id ? 'rgba(255,255,255,0.22)' : 'rgba(10,132,255,0.1)' }}>
                <MapPin className="h-[10px] w-[10px]" style={{ color: selected.id === p.id ? '#fff' : p.color }} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[11px] font-medium">{p.name}</span>
                <span className={`block truncate text-[9px] ${selected.id === p.id ? 'text-white/65' : 'text-black/40'}`}>{p.area}</span>
              </span>
            </button>
          ))}
          {results.length === 0 && <p className="px-2 py-4 text-center text-[10px] text-black/35">No places found</p>}
        </div>
      </div>

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <svg viewBox="0 0 600 460" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="map-sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ed4e8" />
              <stop offset="100%" stopColor="#6fb6d4" />
            </linearGradient>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform={`scale(${zoom})`}>
              <path d="M0 40H40V0" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="460" fill="#e9e4d8" />
          <g transform={`translate(${300 - 300 * zoom} ${230 - 230 * zoom}) scale(${zoom})`} style={{ transition: 'transform 300ms cubic-bezier(0.32,0.72,0,1)' }}>
            <path d="M0 0H210C230 70 190 120 210 180C226 226 190 280 150 310C110 340 80 400 90 460H0V0Z" fill="url(#map-sea)" />
            <path d="M0 330C60 320 100 340 150 340C210 340 260 300 320 310C380 320 420 360 600 340V460H0V330Z" fill="#a8d0b4" opacity="0.7" />
            <path d="M130 460C170 400 220 380 280 372C340 364 390 330 460 340C510 348 550 372 600 380V460H130Z" fill="#cfe3c2" />
            <path d="M210 0C250 90 300 130 350 180C400 230 430 300 470 360C500 400 540 420 600 430" fill="none" stroke="#f7f4ec" strokeWidth="16" />
            <path d="M210 0C250 90 300 130 350 180C400 230 430 300 470 360C500 400 540 420 600 430" fill="none" stroke="#f2c15d" strokeWidth="3.4" strokeDasharray="1 0" />
            <path d="M60 90C140 110 180 170 260 180C340 190 380 140 470 160C520 170 560 200 600 220" fill="none" stroke="#ffffff" strokeWidth="9" />
            <path d="M50 250C120 230 200 250 260 290C320 330 380 300 430 280" fill="none" stroke="#ffffff" strokeWidth="6" />
            <path d="M320 0C330 60 370 110 390 170C410 230 400 310 440 380" fill="none" stroke="#ffffff" strokeWidth="4" />
            <path d="M120 40C160 60 180 100 170 140C160 180 200 200 230 230" fill="none" stroke="#ffffff" strokeWidth="3" />
            <text x="52" y="60" fill="#5c7e92" fontSize="10" fontFamily="Inter, sans-serif" opacity="0.9">Pacific Ocean</text>
            <text x="330" y="250" fill="#7d8f6a" fontSize="11" fontFamily="Inter, sans-serif" opacity="0.9">Los Padres National Forest</text>
            <text x="250" y="330" fill="#7f8a74" fontSize="10" fontFamily="Inter, sans-serif" opacity="0.85">Big Sur</text>
            <text x="470" y="120" fill="#6f7d6b" fontSize="10" fontFamily="Inter, sans-serif" opacity="0.85">Salinas</text>
            <text x="430" y="60" fill="#6f7d6b" fontSize="12" fontFamily="Inter, sans-serif" opacity="0.85">Monterey</text>
            {PLACES.map((p) => (
              <g key={p.id} onClick={() => { setSelected(p); setSaved(false) }} style={{ cursor: 'pointer' }}>
                <circle cx={p.x} cy={p.y} r={selected.id === p.id ? 15 : 11} fill={p.color} opacity={selected.id === p.id ? 0.22 : 0.12} />
                <circle cx={p.x} cy={p.y} r={selected.id === p.id ? 7.5 : 6} fill={p.color} stroke="#fff" strokeWidth="2" />
                {selected.id === p.id && (
                  <text x={p.x + 12} y={p.y + 4} fill="#333" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">
                    {p.name}
                  </text>
                )}
              </g>
            ))}
          </g>
          <rect width="600" height="460" fill="url(#map-grid)" opacity="0.4" pointerEvents="none" />
        </svg>

        <div className="absolute right-[12px] top-[12px] flex flex-col gap-[6px]">
          <div className="flex flex-col overflow-hidden rounded-[8px] border border-black/10 bg-white/90 shadow-md backdrop-blur">
            <button onClick={() => setZoom((z) => Math.min(2.4, z + 0.25))} aria-label="Zoom in" className="grid h-[28px] w-[28px] place-items-center border-b border-black/10 text-black/60 hover:bg-black/[0.04]">
              <Plus className="h-[14px] w-[14px]" />
            </button>
            <button onClick={() => setZoom((z) => Math.max(0.7, z - 0.25))} aria-label="Zoom out" className="grid h-[28px] w-[28px] place-items-center text-black/60 hover:bg-black/[0.04]">
              <span className="text-[16px] leading-none">−</span>
            </button>
          </div>
          <button
            onClick={() => setZoom(1)}
            aria-label="Center map"
            className="grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-black/10 bg-white/90 text-black/60 shadow-md backdrop-blur hover:bg-white"
          >
            <Compass className="h-[14px] w-[14px]" />
          </button>
        </div>

        <div className="absolute inset-x-[12px] bottom-[12px] rounded-[11px] border border-black/[0.08] bg-[#fbfbf9]/95 p-[11px] shadow-[0_8px_26px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:left-[12px] sm:right-auto sm:w-[280px]">
          <div className="flex items-start gap-[9px]">
            <span className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-[7px] text-white" style={{ background: selected.color }}>
              <MapPin className="h-[15px] w-[15px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold">{selected.name}</p>
              <p className="truncate text-[10px] text-black/40">{selected.area}</p>
              <p className="mt-[2px] text-[9.5px] text-black/35">Scenic overlook · Open until sunset</p>
            </div>
          </div>
          <div className="mt-[8px] flex gap-[6px]">
            <button className="flex-1 rounded-[6px] bg-[#0a84ff] py-[3px] text-[10px] font-semibold text-white hover:brightness-110">Directions</button>
            <button onClick={() => setSaved((v) => !v)} className={`flex-1 rounded-[6px] border py-[3px] text-[10px] font-medium ${saved ? 'border-[#0a84ff]/30 bg-[#0a84ff]/10 text-[#0a84ff]' : 'border-black/10 bg-white text-black/55'}`}>
              {saved ? 'Saved' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Contacts --------------------------------- */

const CONTACTS = [
  { name: 'Ana Rivera', role: 'Product Designer', company: 'Studio Fold', phone: '+1 (415) 555-0132', email: 'ana@studiofold.com', city: 'San Francisco' },
  { name: 'Noah Kim', role: 'Engineer', company: 'Northwind', phone: '+1 (415) 555-0178', email: 'noah@northwind.io', city: 'Oakland' },
  { name: 'Maya Chen', role: 'Photographer', company: 'Independent', phone: '+1 (831) 555-0110', email: 'maya@chen.photo', city: 'Monterey' },
  { name: 'Liam Patel', role: 'Creative Director', company: 'Atlas & Co', phone: '+1 (212) 555-0193', email: 'liam@atlas.co', city: 'New York' },
  { name: 'Sofia Rossi', role: 'Writer', company: 'The Quarterly', phone: '+1 (310) 555-0155', email: 'sofia@quarterly.com', city: 'Los Angeles' },
  { name: 'Ethan Brooks', role: 'Sound Designer', company: 'Waveform', phone: '+1 (503) 555-0164', email: 'ethan@waveform.audio', city: 'Portland' },
  { name: 'Grace Lee', role: 'Illustrator', company: 'Independent', phone: '+1 (206) 555-0121', email: 'grace@leestudio.art', city: 'Seattle' },
]

export function ContactsApp() {
  const [selected, setSelected] = useState(CONTACTS[0])
  const [query, setQuery] = useState('')
  const [favorite, setFavorite] = useState(false)
  const list = CONTACTS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex h-full min-h-0 bg-white">
      <div className="hidden w-[205px] shrink-0 flex-col border-r border-black/[0.07] bg-[#f2f3f5]/85 md:flex">
        <div className="px-[12px] pb-[8px] pt-[10px]">
          <p className="text-[13px] font-bold">Contacts</p>
        </div>
        <div className="flex-1 overflow-y-auto px-[7px]">
          <div className="mb-[2px] px-[6px] text-[10px] font-semibold text-black/35">All Contacts</div>
          {CONTACTS.map((c, i) => (
            <button
              key={c.name}
              onClick={() => { setSelected(c); setFavorite(false) }}
              className={`flex w-full items-center gap-[7px] rounded-[5px] px-[6px] py-[4px] text-left ${
                selected.name === c.name ? 'bg-[#0a84ff] text-white' : 'hover:bg-black/[0.04]'
              }`}
            >
              <Avatar name={c.name} size={23} index={i} />
              <span className="truncate text-[11px]">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[44px] shrink-0 items-center gap-[8px] border-b border-black/[0.07] px-[12px]">
          <label className="flex h-[24px] w-[170px] items-center gap-[5px] rounded-[6px] border border-black/[0.08] bg-black/[0.03] px-[7px]">
            <Search className="h-[11px] w-[11px] text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-[10.5px] outline-none placeholder:text-black/30"
            />
          </label>
          <button className="ml-auto grid h-[24px] w-[24px] place-items-center rounded-[5px] text-[#0a84ff] hover:bg-black/[0.05]" aria-label="Add contact">
            <Plus className="h-[15px] w-[15px]" />
          </button>
          <button onClick={() => setFavorite((v) => !v)} aria-label="Favorite" className="grid h-[24px] w-[24px] place-items-center rounded-[5px] text-[#ff9f43] hover:bg-black/[0.05]">
            <Star className="h-[14px] w-[14px]" fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        {list.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-[11px] text-black/30">No contacts found</div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-[22px] py-[18px]">
            <div className="flex flex-col items-center pb-[14px] text-center">
              <Avatar name={selected.name} size={68} index={CONTACTS.findIndex((c) => c.name === selected.name)} />
              <h1 className="mt-[9px] text-[19px] font-semibold tracking-[-0.3px]">{selected.name}</h1>
              <p className="text-[11px] text-black/45">{selected.role} · {selected.company}</p>
              <div className="mt-[10px] flex gap-[14px]">
                {[
                  { icon: <MessageSquare className="h-[14px] w-[14px]" />, label: 'message' },
                  { icon: <Phone className="h-[14px] w-[14px]" />, label: 'call' },
                  { icon: <Video className="h-[14px] w-[14px]" />, label: 'video' },
                  { icon: <Mail className="h-[14px] w-[14px]" />, label: 'mail' },
                ].map((a) => (
                  <button key={a.label} className="grid h-[28px] w-[28px] place-items-center rounded-full bg-[#0a84ff]/10 text-[#0a84ff] hover:bg-[#0a84ff]/20" aria-label={a.label}>
                    {a.icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-[9px] border border-black/[0.07] bg-white">
              {[
                { label: 'mobile', value: selected.phone },
                { label: 'email', value: selected.email },
                { label: 'address', value: selected.city },
              ].map((row, i, arr) => (
                <div key={row.label} className={`flex items-center justify-between px-[12px] py-[8px] ${i < arr.length - 1 ? 'border-b border-black/[0.06]' : ''}`}>
                  <span className="text-[10px] text-black/35">{row.label}</span>
                  <span className="text-[11px] text-[#0a84ff]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ----------------------------------- Mail ----------------------------------- */

interface Email {
  id: number
  from: string
  subject: string
  preview: string
  body: string[]
  time: string
  unread?: boolean
  flagged?: boolean
}

const EMAILS: Email[] = [
  {
    id: 1,
    from: 'Ana Rivera',
    subject: 'Final motion specs',
    preview: 'I’ve attached the timing curves for the window and dock animations…',
    body: [
      'Hey,',
      'I’ve attached the timing curves we discussed. The window open should settle around 320ms, with a touch of overshoot on the scale. The dock magnification is a bit springier — stiffness around 460 feels right.',
      'Could you take a look before tomorrow’s review?',
      'Thanks,\nAna',
    ],
    time: '9:24 AM',
    unread: true,
  },
  {
    id: 2,
    from: 'Noah Kim',
    subject: 'Re: Desktop wallpaper assets',
    preview: 'The 5K exports are in the shared folder now.',
    body: ['The 5K exports are in the shared folder now. I included the original gradient layers too, in case we need to tweak the color balance for smaller screens.', '— Noah'],
    time: '8:02 AM',
    unread: true,
    flagged: true,
  },
  {
    id: 3,
    from: 'Maya Chen',
    subject: 'Photos from the coast',
    preview: 'A few frames from Tuesday morning. The fog was perfect.',
    body: ['A few frames from Tuesday morning. The fog was perfect.', 'I’ll send the full set once they’re edited. Feel free to use any of these in the mockups.', 'Maya'],
    time: 'Yesterday',
  },
  {
    id: 4,
    from: 'Apple',
    subject: 'Your receipt from Apple',
    preview: 'Thank you for your purchase.',
    body: ['Thank you for your purchase.', 'iCloud+ 200 GB — $2.99/month', 'You can manage your subscription at any time in System Preferences.'],
    time: 'Yesterday',
  },
  {
    id: 5,
    from: 'Liam Patel',
    subject: 'Lunch next week?',
    preview: 'I’m in town Tuesday and Wednesday.',
    body: ['I’m in town Tuesday and Wednesday. Free around 1pm either day?', 'Liam'],
    time: 'Monday',
  },
]

export function MailApp() {
  const [emails, setEmails] = useState(EMAILS)
  const [selectedId, setSelectedId] = useState(EMAILS[0].id)
  const [query, setQuery] = useState('')
  const [compose, setCompose] = useState(false)
  const [sent, setSent] = useState(false)
  const selected = emails.find((e) => e.id === selectedId)

  const open = (id: number) => {
    setSelectedId(id)
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, unread: false } : e)))
  }

  const list = emails.filter((e) => `${e.from} ${e.subject} ${e.preview}`.toLowerCase().includes(query.toLowerCase()))
  const unread = emails.filter((e) => e.unread).length

  return (
    <div className="relative flex h-full min-h-0 bg-white">
      <div className="hidden w-[172px] shrink-0 flex-col border-r border-black/[0.07] bg-[#f2f3f5]/85 px-[8px] pb-3 pt-[10px] sm:flex">
        <div className="mb-[10px] flex items-center justify-between px-[6px]">
          <span className="text-[13px] font-bold">Mail</span>
          <button onClick={() => { setCompose(true); setSent(false) }} aria-label="New message" className="grid h-[20px] w-[20px] place-items-center rounded-[5px] text-[#0a84ff] hover:bg-black/[0.06]">
            <Plus className="h-[14px] w-[14px]" />
          </button>
        </div>
        <div className="mb-[6px] px-[7px] text-[10px] font-semibold text-black/35">iCloud</div>
        {[
          { name: 'Inbox', icon: <Inbox className="h-[13px] w-[13px]" />, count: unread },
          { name: 'VIP', icon: <Star className="h-[13px] w-[13px]" />, count: 1 },
          { name: 'Sent', icon: <Send className="h-[13px] w-[13px]" /> },
          { name: 'Drafts', icon: <Paperclip className="h-[13px] w-[13px]" />, count: 0 },
          { name: 'Junk', icon: <Trash2 className="h-[13px] w-[13px]" /> },
        ].map((m, i) => (
          <button key={m.name} className={`flex h-[25px] w-full items-center gap-[7px] rounded-[5px] px-[7px] text-[11px] ${i === 0 ? 'bg-[#0a84ff] text-white' : 'text-[#3a3a3c] hover:bg-black/[0.04]'}`}>
            <span className={i === 0 ? 'text-white' : 'text-[#0a84ff]'}>{m.icon}</span>
            <span className="flex-1 text-left">{m.name}</span>
            {!!m.count && <span className={`text-[9px] ${i === 0 ? 'text-white/70' : 'text-black/35'}`}>{m.count}</span>}
          </button>
        ))}
      </div>

      <div className="flex w-full shrink-0 flex-col border-r border-black/[0.07] sm:w-[238px]">
        <div className="flex h-[38px] shrink-0 items-center gap-[5px] border-b border-black/[0.07] px-[9px]">
          <label className="flex h-[24px] flex-1 items-center gap-[5px] rounded-[6px] border border-black/[0.08] bg-black/[0.03] px-[7px]">
            <Search className="h-[11px] w-[11px] text-black/35" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full bg-transparent text-[10.5px] outline-none placeholder:text-black/30" />
          </label>
          <button className="grid h-[22px] w-[22px] place-items-center rounded-[5px] text-black/40 hover:bg-black/[0.05]" aria-label="Filter">
            <Settings2 className="h-[12px] w-[12px]" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {list.map((e) => (
            <button
              key={e.id}
              onClick={() => open(e.id)}
              className={`w-full border-b border-black/[0.055] px-[10px] py-[7px] text-left ${selectedId === e.id ? 'bg-[#0a84ff] text-white' : e.unread ? 'bg-[#0a84ff]/[0.035] hover:bg-black/[0.03]' : 'hover:bg-black/[0.025]'}`}
            >
              <div className="flex items-center gap-[5px]">
                {e.unread && <span className={`h-[5px] w-[5px] shrink-0 rounded-full ${selectedId === e.id ? 'bg-white' : 'bg-[#0a84ff]'}`} />}
                <span className={`truncate text-[11px] ${e.unread ? 'font-semibold' : 'font-medium'}`}>{e.from}</span>
                <span className={`ml-auto shrink-0 text-[8.5px] ${selectedId === e.id ? 'text-white/65' : 'text-black/35'}`}>{e.time}</span>
              </div>
              <p className={`mt-[1px] truncate text-[10.5px] ${selectedId === e.id ? 'text-white/90' : 'text-[#2b2b2e]'}`}>{e.subject}</p>
              <p className={`mt-[1px] line-clamp-2 text-[9.5px] leading-[12px] ${selectedId === e.id ? 'text-white/60' : 'text-black/40'}`}>{e.preview}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 flex-col md:flex">
        {selected ? (
          <>
            <div className="flex h-[38px] shrink-0 items-center gap-[6px] border-b border-black/[0.07] px-[12px] text-black/45">
              <button className="grid h-[22px] w-[22px] place-items-center rounded-[5px] hover:bg-black/[0.05]" aria-label="Reply"><ArrowLeft className="h-[13px] w-[13px]" /></button>
              <button className="grid h-[22px] w-[22px] place-items-center rounded-[5px] hover:bg-black/[0.05]" aria-label="Archive"><Inbox className="h-[13px] w-[13px]" /></button>
              <button onClick={() => setEmails((prev) => prev.filter((e) => e.id !== selected.id))} className="grid h-[22px] w-[22px] place-items-center rounded-[5px] hover:bg-black/[0.05]" aria-label="Delete"><Trash2 className="h-[13px] w-[13px]" /></button>
              <span className="mx-[4px] h-[14px] w-px bg-black/10" />
              <button className="grid h-[22px] w-[22px] place-items-center rounded-[5px] hover:bg-black/[0.05]" aria-label="Flag"><Star className="h-[13px] w-[13px]" /></button>
              <div className="ml-auto flex items-center gap-[4px] text-[9.5px] text-black/30">
                <span>{emails.length} messages</span>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-[20px] py-[14px]">
              <h1 className="text-[17px] font-semibold tracking-[-0.3px]">{selected.subject}</h1>
              <div className="mt-[10px] flex items-center gap-[8px] border-b border-black/[0.07] pb-[10px]">
                <Avatar name={selected.from} size={30} index={emails.findIndex((e) => e.id === selected.id)} />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold">{selected.from}</p>
                  <p className="text-[9px] text-black/35">to Rizky · {selected.time}</p>
                </div>
                <button className="ml-auto text-[9.5px] text-black/30 hover:text-black/60">Details</button>
              </div>
              <div className="mt-[12px] space-y-[10px] text-[11.5px] leading-[19px] text-[#2b2b2e]">
                {selected.body.map((p, i) => (
                  <p key={i} className="whitespace-pre-line">{p}</p>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-[11px] text-black/30">No message selected</div>
        )}
      </div>

      {compose && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/15 backdrop-blur-[2px]" onClick={() => setCompose(false)}>
          <div
            className="w-[92%] max-w-[520px] overflow-hidden rounded-[10px] border border-black/20 bg-[#f6f6f8] shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[34px] items-center justify-between border-b border-black/10 bg-[#ececf0] px-[11px]">
              <span className="text-[11px] font-semibold">New Message</span>
              <button onClick={() => setCompose(false)} aria-label="Close" className="grid h-[20px] w-[20px] place-items-center rounded-[4px] text-black/40 hover:bg-black/10">
                <X className="h-[12px] w-[12px]" />
              </button>
            </div>
            <div className="px-[12px] py-[6px]">
              <div className="flex items-center gap-[6px] border-b border-black/10 py-[5px] text-[11px]">
                <span className="w-[40px] shrink-0 text-black/40">To:</span>
                <input className="w-full bg-transparent outline-none" placeholder="Name or email" />
              </div>
              <div className="flex items-center gap-[6px] border-b border-black/10 py-[5px] text-[11px]">
                <span className="w-[40px] shrink-0 text-black/40">Subject:</span>
                <input className="w-full bg-transparent outline-none" defaultValue={sent ? 'Sent from my Mac' : ''} />
              </div>
              <textarea className="mt-[8px] h-[130px] w-full resize-none bg-transparent text-[11px] outline-none" placeholder="Write your message…" />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 bg-[#f0f0f3] px-[12px] py-[6px]">
              <button className="rounded-[5px] border border-black/10 bg-white px-[9px] py-[3px] text-[10px] text-black/50">Attach</button>
              <button onClick={() => { setCompose(false); setSent(true) }} className="rounded-[5px] bg-[#0a84ff] px-[12px] py-[3px] text-[10px] font-semibold text-white">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------- TV & Podcasts ------------------------------ */

const SHOWS = [
  { title: 'The Long Coast', sub: 'Season 2 · Episode 4', variant: 0 },
  { title: 'Mountain Lines', sub: 'Documentary', variant: 3 },
  { title: 'After Hours', sub: 'Season 1 · Episode 7', variant: 5 },
  { title: 'Color Theory', sub: 'New series', variant: 2 },
  { title: 'Pacific', sub: 'Season 3 · Episode 1', variant: 6 },
  { title: 'Into the Fog', sub: 'Film', variant: 1 },
]

export function TVApp() {
  return (
    <div className="flex h-full min-h-0 bg-[#101013] text-white">
      <div className="hidden w-[166px] shrink-0 flex-col border-r border-white/10 bg-[#17171b] px-[8px] pt-[12px] md:flex">
        <p className="mb-[12px] px-[8px] text-[13px] font-bold">TV</p>
        {['Watch Now', 'Movies', 'TV Shows', 'Sports', 'Kids', 'Library'].map((s, i) => (
          <button key={s} className={`flex h-[26px] items-center rounded-[5px] px-[8px] text-[11px] ${i === 0 ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-[18px]">
        <h1 className="text-[20px] font-semibold tracking-[-0.4px]">Watch Now</h1>
        <div className="mt-[12px] grid grid-cols-2 gap-[12px] sm:grid-cols-3">
          {SHOWS.map((s) => (
            <button key={s.title} className="group text-left">
              <div className="relative aspect-[2/3] overflow-hidden rounded-[8px] bg-white/5">
                <PhotoArt variant={s.variant} className="h-full w-full transition-transform duration-300 group-hover:scale-[1.04]" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-[8px] left-[8px] right-[8px]">
                  <span className="block truncate text-[11px] font-semibold">{s.title}</span>
                  <span className="block truncate text-[8.5px] text-white/55">{s.sub}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
        <h2 className="mt-[20px] text-[14px] font-semibold">Continue Watching</h2>
        <div className="mt-[8px] flex gap-[10px] overflow-x-auto pb-2">
          {SHOWS.slice(0, 4).map((s) => (
            <div key={s.title} className="w-[150px] shrink-0">
              <PhotoArt variant={s.variant + 2} className="h-[84px] w-full rounded-[6px]" />
              <div className="mt-[5px] h-[3px] w-full rounded-full bg-white/15"><div className="h-full w-1/2 rounded-full bg-white/70" /></div>
              <p className="mt-[4px] truncate text-[9.5px] text-white/70">{s.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PodcastsApp() {
  const [playing, setPlaying] = useState<number | null>(0)
  const episodes = [
    { title: 'The shape of interfaces', show: 'Design Details', duration: '42 min', variant: 2 },
    { title: 'Why motion matters', show: 'Interface Weekly', duration: '38 min', variant: 5 },
    { title: 'Building for the desktop', show: 'The macOS Show', duration: '51 min', variant: 0 },
    { title: 'Color and light', show: 'Design Details', duration: '35 min', variant: 7 },
  ]
  return (
    <div className="flex h-full min-h-0 bg-[#fbf8fd]">
      <div className="hidden w-[176px] shrink-0 flex-col border-r border-black/[0.06] bg-[#f6f0fa]/80 px-[8px] pt-[10px] md:flex">
        <p className="mb-[12px] px-[8px] text-[13px] font-bold text-[#7b3ed6]">Podcasts</p>
        {['Listen Now', 'Browse', 'Top Charts', 'Library'].map((s, i) => (
          <button key={s} className={`flex h-[25px] items-center rounded-[5px] px-[8px] text-[11px] ${i === 0 ? 'bg-[#7b3ed6] text-white' : 'text-[#3a3a3c] hover:bg-black/[0.04]'}`}>{s}</button>
        ))}
        <div className="mb-[4px] mt-[14px] px-[8px] text-[10px] font-semibold text-black/35">Shows</div>
        {['Design Details', 'Interface Weekly', 'The macOS Show'].map((s) => (
          <button key={s} className="flex h-[25px] items-center gap-[6px] rounded-[5px] px-[8px] text-[11px] text-[#3a3a3c] hover:bg-black/[0.04]">
            <span className="h-[7px] w-[7px] rounded-full bg-[#c07bf6]" />{s}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-[18px]">
        <h1 className="text-[18px] font-bold tracking-[-0.3px]">Listen Now</h1>
        <p className="text-[10.5px] text-black/40">New episodes from shows you follow</p>
        <div className="mt-[12px] space-y-[8px]">
          {episodes.map((e, i) => (
            <div key={e.title} className="flex items-center gap-[10px] rounded-[9px] border border-black/[0.06] bg-white p-[9px] shadow-sm">
              <PhotoArt variant={e.variant} className="h-[46px] w-[46px] shrink-0 rounded-[6px]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] font-semibold">{e.title}</p>
                <p className="truncate text-[9.5px] text-black/40">{e.show} · {e.duration}</p>
              </div>
              <button
                onClick={() => setPlaying((p) => (p === i ? null : i))}
                aria-label={playing === i ? 'Pause' : 'Play'}
                className="grid h-[27px] w-[27px] place-items-center rounded-full bg-[#7b3ed6] text-white hover:brightness-110"
              >
                {playing === i ? <Pause className="h-[12px] w-[12px]" fill="currentColor" /> : <Play className="ml-[1px] h-[12px] w-[12px]" fill="currentColor" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- News ------------------------------------ */

const ARTICLES = [
  { title: 'The quiet return of the desktop', cat: 'Technology', variant: 4, read: '6 min' },
  { title: 'Inside the color palette of Big Sur', cat: 'Design', variant: 0, read: '4 min' },
  { title: 'How Apple thinks about motion', cat: 'Features', variant: 8, read: '8 min' },
  { title: 'A weekend on the Pacific coast', cat: 'Travel', variant: 1, read: '5 min' },
]

export function NewsApp() {
  const [active, setActive] = useState(0)
  return (
    <div className="flex h-full min-h-0 bg-white">
      <div className="hidden w-[166px] shrink-0 flex-col border-r border-black/[0.07] bg-[#f7f7f8] px-[8px] pt-[10px] md:flex">
        <p className="mb-[10px] px-[8px] text-[13px] font-bold">News</p>
        {['Today', 'Following', 'Saved Stories', 'History', 'Explore'].map((s, i) => (
          <button key={s} className={`flex h-[25px] items-center rounded-[5px] px-[8px] text-[11px] ${i === 0 ? 'bg-[#fa4b5b] text-white' : 'text-[#3a3a3c] hover:bg-black/[0.04]'}`}>{s}</button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-black/[0.07] px-[18px] py-[12px]">
          <h1 className="text-[18px] font-bold tracking-[-0.4px]">Today</h1>
          <p className="text-[9.5px] text-black/35">Tuesday, October 20</p>
        </div>
        <div className="p-[16px]">
          <button onClick={() => setActive(0)} className="w-full text-left">
            <PhotoArt variant={ARTICLES[active].variant} className="h-[170px] w-full rounded-[10px]" />
            <p className="mt-[9px] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#fa4b5b]">{ARTICLES[active].cat}</p>
            <h2 className="mt-[2px] text-[19px] font-bold leading-[23px] tracking-[-0.4px]">{ARTICLES[active].title}</h2>
            <p className="mt-[4px] text-[10.5px] leading-[16px] text-black/50">
              A closer look at how thoughtful interface design shapes the way we work, create, and move through
              the digital world.
            </p>
          </button>
          <div className="mt-[14px] divide-y divide-black/[0.07]">
            {ARTICLES.slice(1).map((a, i) => (
              <button key={a.title} onClick={() => setActive(i + 1)} className="flex w-full gap-[10px] py-[10px] text-left">
                <div className="min-w-0 flex-1">
                  <p className="text-[8.5px] font-semibold uppercase tracking-[0.1em] text-[#fa4b5b]">{a.cat}</p>
                  <p className="mt-[2px] text-[12px] font-semibold leading-[16px]">{a.title}</p>
                  <p className="mt-[2px] text-[9px] text-black/35">{a.read} read</p>
                </div>
                <PhotoArt variant={a.variant} className="h-[58px] w-[76px] shrink-0 rounded-[7px]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- App Store -------------------------------- */

export function AppStoreApp() {
  const apps = [
    { name: 'Sparkle', tagline: 'Design your space', icon: 'photos', color: '#4aa8ff' },
    { name: 'Lumen', tagline: 'Photo editing, reimagined', icon: 'music', color: '#fa2d48' },
    { name: 'Tide', tagline: 'Calm focus timer', icon: 'calendar', color: '#3ed37b' },
    { name: 'Orbit', tagline: 'Notes that connect', icon: 'notes', color: '#ffd60a' },
  ]
  return (
    <div className="flex h-full min-h-0 bg-[#fbfbfd]">
      <div className="hidden w-[172px] shrink-0 flex-col border-r border-black/[0.07] bg-[#f2f3f5]/85 px-[8px] pt-[10px] md:flex">
        <p className="mb-[10px] px-[8px] text-[13px] font-bold">App Store</p>
        {['Discover', 'Arcade', 'Create', 'Work', 'Play', 'Develop', 'Categories', 'Updates'].map((s, i) => (
          <button key={s} className={`flex h-[25px] items-center rounded-[5px] px-[8px] text-[11px] ${i === 0 ? 'bg-[#0a84ff] text-white' : 'text-[#3a3a3c] hover:bg-black/[0.04]'}`}>{s}</button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-[18px]">
        <div className="relative overflow-hidden rounded-[13px] bg-gradient-to-br from-[#17233f] via-[#2f3f6e] to-[#7b4b8f] p-[20px] text-white">
          <div className="absolute -right-10 -top-10 h-[180px] w-[180px] rounded-full bg-[#ff8a5c]/40 blur-[60px]" />
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">App of the Day</p>
          <h1 className="mt-[6px] max-w-[280px] text-[24px] font-bold leading-[27px] tracking-[-0.6px]">Design without limits.</h1>
          <p className="mt-[6px] max-w-[300px] text-[10px] leading-[15px] text-white/60">A new generation of creative tools, made for the Mac.</p>
          <div className="mt-[12px] flex gap-[8px]">
            <button className="rounded-full bg-white px-[12px] py-[4px] text-[10px] font-semibold text-black">Get</button>
            <button className="rounded-full border border-white/20 px-[12px] py-[4px] text-[10px] text-white/80">Learn more</button>
          </div>
        </div>
        <h2 className="mb-[8px] mt-[18px] text-[13px] font-bold">Apps We Love</h2>
        <div className="grid grid-cols-2 gap-[8px] sm:grid-cols-4">
          {apps.map((a) => {
            const Glyph = APP_ICONS[a.icon]
            return (
              <div key={a.name} className="rounded-[10px] border border-black/[0.06] bg-white p-[9px] shadow-sm">
                <Glyph className="h-[38px] w-[38px]" />
                <p className="mt-[7px] truncate text-[10.5px] font-semibold">{a.name}</p>
                <p className="truncate text-[8.5px] text-black/35">{a.tagline}</p>
                <div className="mt-[6px] flex items-center justify-between">
                  <span className="text-[8px] text-black/30">Free</span>
                  <button className="rounded-full bg-[#0a84ff]/10 px-[8px] py-[1px] text-[8.5px] font-semibold text-[#0a84ff]">GET</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- FaceTime -------------------------------- */

export function FaceTimeApp() {
  const [inCall, setInCall] = useState(false)
  const [muted, setMuted] = useState(false)
  const [video, setVideo] = useState(true)
  return (
    <div className="flex h-full min-h-0 bg-[#141416] text-white">
      {!inCall ? (
        <div className="flex flex-1 flex-col items-center justify-center p-[24px] text-center">
          <div className="relative h-[120px] w-[190px] overflow-hidden rounded-[12px] border border-white/10 bg-gradient-to-br from-[#3a4f7a] to-[#1a1d2b] shadow-2xl">
            <div className="absolute -right-8 -top-10 h-[90px] w-[90px] rounded-full bg-[#ff9a6b]/40 blur-[30px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="h-[30px] w-[30px] text-white/50" strokeWidth={1.4} />
            </div>
          </div>
          <h1 className="mt-[16px] text-[20px] font-semibold tracking-[-0.3px]">FaceTime</h1>
          <p className="mt-[4px] max-w-[260px] text-[10.5px] leading-[15px] text-white/40">
            Make a video or audio call from your Mac. Recent calls appear here.
          </p>
          <button
            onClick={() => setInCall(true)}
            className="mt-[14px] rounded-full bg-[#30d158] px-[18px] py-[6px] text-[11px] font-semibold text-black hover:brightness-110"
          >
            New FaceTime
          </button>
          <div className="mt-[22px] w-full max-w-[300px] space-y-[2px] text-left">
            <p className="px-[4px] text-[9px] font-semibold text-white/30">Recent</p>
            {['Ana Rivera', 'Design Team', 'Noah Kim'].map((n, i) => (
              <button key={n} onClick={() => setInCall(true)} className="flex w-full items-center gap-[8px] rounded-[7px] px-[6px] py-[6px] hover:bg-white/5">
                <Avatar name={n} size={26} index={i} />
                <div className="flex-1 text-left">
                  <p className="text-[10.5px]">{n}</p>
                  <p className="text-[8.5px] text-white/30">Incoming · {i + 1} day ago</p>
                </div>
                <Video className="h-[13px] w-[13px] text-white/30" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex flex-1 flex-col bg-[#0c0c0e]">
          <div className="relative m-[12px] flex-1 overflow-hidden rounded-[12px] bg-gradient-to-br from-[#26324c] via-[#1a1d2b] to-[#0c0c0e]">
            {video ? (
              <>
                <PhotoArt variant={3} className="absolute inset-0 h-full w-full opacity-40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Avatar name="Ana Rivera" size={64} index={0} />
                  <p className="mt-[8px] text-[14px] font-medium">Ana Rivera</p>
                  <p className="text-[9.5px] text-white/40">Connected · 02:14</p>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Avatar name="Ana Rivera" size={64} index={0} />
                <p className="mt-[8px] text-[14px] font-medium">Ana Rivera</p>
                <p className="text-[9.5px] text-white/40">Camera off</p>
              </div>
            )}
            <div className="absolute bottom-[10px] right-[10px] h-[62px] w-[92px] overflow-hidden rounded-[7px] border border-white/20 bg-[#22262f]">
              <div className="flex h-full items-center justify-center text-[8px] text-white/40">You</div>
            </div>
          </div>
          <div className="flex h-[52px] shrink-0 items-center justify-center gap-[10px]">
            <button onClick={() => setMuted((v) => !v)} aria-label="Mute" className={`grid h-[30px] w-[30px] place-items-center rounded-full ${muted ? 'bg-white text-black' : 'bg-white/[0.12] text-white hover:bg-white/20'}`}>
              {muted ? <MicOff className="h-[14px] w-[14px]" /> : <Mic className="h-[14px] w-[14px]" />}
            </button>
            <button onClick={() => setVideo((v) => !v)} aria-label="Camera" className={`grid h-[30px] w-[30px] place-items-center rounded-full ${!video ? 'bg-white text-black' : 'bg-white/[0.12] text-white hover:bg-white/20'}`}>
              {video ? <Video className="h-[14px] w-[14px]" /> : <VideoOff className="h-[14px] w-[14px]" />}
            </button>
            <button onClick={() => setInCall(false)} aria-label="End call" className="grid h-[32px] w-[52px] place-items-center rounded-full bg-[#ff453a] text-white hover:brightness-110">
              <Phone className="h-[16px] w-[16px] rotate-[135deg]" fill="currentColor" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------- Pages & Numbers ---------------------------- */

export function PagesApp() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#ececee]">
      <div className="flex h-[36px] shrink-0 items-center gap-[10px] border-b border-black/10 bg-[#f6f6f8] px-[12px] text-black/45">
        <button className="rounded-[5px] border border-black/10 bg-white px-[8px] py-[2px] text-[10px] font-medium text-black/55">Templates</button>
        <span className="h-[14px] w-px bg-black/10" />
        <span className="text-[10px] font-medium">Body</span>
        <span className="text-[10px]">14</span>
        <span className="h-[14px] w-px bg-black/10" />
        <span className="font-bold">B</span>
        <span className="italic">I</span>
        <span className="underline">U</span>
        <div className="ml-auto flex items-center gap-[8px] text-[10px]">
          <Share className="h-[13px] w-[13px]" />
          <button className="rounded-[5px] bg-[#0a84ff] px-[9px] py-[2px] text-white">Done</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-[18px]">
        <div className="mx-auto min-h-[95%] w-full max-w-[560px] bg-white px-[38px] py-[34px] shadow-[0_2px_14px_rgba(0,0,0,0.16)]">
          <h1 className="text-[26px] font-bold leading-[31px] tracking-[-0.6px] text-[#1d1d1f]">
            A calmer way to work
          </h1>
          <p className="mt-[4px] text-[10px] text-black/35">Design notes · October 2026</p>
          <div className="my-[14px] h-px bg-black/10" />
          <p className="text-[11px] leading-[19px] text-[#333336]">
            The best interfaces disappear. They give you a clear surface, a few well-placed controls, and
            motion that explains what just happened. Everything else is noise.
          </p>
          <h2 className="mt-[16px] text-[14px] font-semibold tracking-[-0.2px]">Principles</h2>
          <ul className="mt-[6px] space-y-[4px] text-[11px] leading-[18px] text-[#333336]">
            <li>• Prefer depth through light and blur, not borders.</li>
            <li>• Use motion to connect cause and effect.</li>
            <li>• Keep controls close to the content they affect.</li>
            <li>• Let the wallpaper set the mood.</li>
          </ul>
          <div className="mt-[18px] rounded-[6px] bg-[#f5f5f7] p-[12px]">
            <p className="text-[10px] font-semibold text-black/55">A note on timing</p>
            <p className="mt-[3px] text-[10px] leading-[16px] text-black/45">
              Small elements should respond in 120–180 ms. Windows and panels can take a little longer, but the
              motion should always feel like it began the moment you clicked.
            </p>
          </div>
          <p className="mt-[18px] text-[11px] leading-[19px] text-[#333336]">
            The desktop is a place, not a page. Treat it with the same care you would give a physical workspace:
            a few objects, arranged deliberately, with room to breathe.
          </p>
        </div>
      </div>
    </div>
  )
}

export function NumbersApp() {
  const rows = [
    ['', 'A', 'B', 'C', 'D'],
    ['1', 'Month', 'Revenue', 'Costs', 'Profit'],
    ['2', 'July', '18,400', '9,200', '9,200'],
    ['3', 'August', '21,750', '10,100', '11,650'],
    ['4', 'September', '19,300', '9,850', '9,450'],
    ['5', 'October', '24,100', '11,400', '12,700'],
    ['6', '', '', '', ''],
    ['7', 'Total', '83,550', '40,550', '43,000'],
  ]
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#ececee]">
      <div className="flex h-[36px] shrink-0 items-center gap-[10px] border-b border-black/10 bg-[#f6f6f8] px-[12px] text-black/45">
        <button className="rounded-[5px] border border-black/10 bg-white px-[8px] py-[2px] text-[10px] font-medium text-black/55">Templates</button>
        <span className="h-[14px] w-px bg-black/10" />
        <span className="text-[10px] font-medium">Table 1</span>
        <span className="text-[10px]">Helvetica Neue · 11</span>
        <span className="h-[14px] w-px bg-black/10" />
        <span className="font-bold">B</span>
        <span className="italic">I</span>
        <span className="underline">U</span>
        <div className="ml-auto flex items-center gap-[8px] text-[10px]">
          <Share className="h-[13px] w-[13px]" />
          <button className="rounded-[5px] bg-[#0a84ff] px-[9px] py-[2px] text-white">Done</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-[#e7e7ea] p-[16px]">
        <div className="min-w-[430px] overflow-hidden rounded-[3px] border border-black/15 bg-white shadow-[0_2px_14px_rgba(0,0,0,0.14)]">
          {rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-[34px_1fr_1fr_1fr_1fr]">
              {row.map((cell, ci) => (
                <div
                  key={ci}
                  className={`flex h-[26px] items-center border-b border-r border-black/[0.09] px-[7px] text-[10px] ${
                    ri === 0 || ci === 0 ? 'bg-[#f5f5f7] text-center font-medium text-black/45' : ''
                  } ${ci === 0 && ri === 0 ? 'bg-[#ececf0]' : ''} ${
                    ci === 4 && ri > 0 ? 'font-medium text-[#1d8f3f]' : ''
                  } ${ri === 1 ? 'bg-[#fafafa] font-semibold' : ''} ${ri === rows.length - 1 ? 'bg-[#f7f7f9] font-semibold' : ''}`}
                >
                  {ci === 0 ? cell : <span className={ci > 1 ? 'ml-auto tabular-nums' : 'tabular-nums'}>{cell}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-[16px] w-full max-w-[520px] rounded-[6px] bg-white/70 p-[12px]">
          <p className="text-[11px] font-semibold text-black/60">Quarterly summary</p>
          <p className="mt-[3px] text-[10px] leading-[16px] text-black/40">
            Revenue grew steadily through the quarter, with October showing a 25% increase over July. Costs
            stayed proportional, leaving a healthy margin.
          </p>
        </div>
      </div>
    </div>
  )
}
