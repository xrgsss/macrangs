import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Bold,
  Check,
  CheckSquare,
  ChevronLeft,
  Italic,
  ListPlus,
  Plus,
  Search,
  Share,
  Trash2,
  Underline,
} from 'lucide-react'

interface Note {
  id: string
  title: string
  body: string
  updated: number
  folder: string
}

const INITIAL_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Big Sur design notes',
    body: 'Interface principles\n\n• Frosted glass surfaces with careful use of blur.\n• Rounded corners and soft, layered shadows.\n• Motion should feel physical, never decorative.\n• Keep the desktop calm and let content lead.\n\nFollow up on dock magnification timing — the spring should settle quickly, with only a hint of overshoot.',
    updated: Date.now() - 1000 * 60 * 24,
    folder: 'Notes',
  },
  {
    id: 'n2',
    title: 'Weekend in Big Sur',
    body: 'Drive down Highway 1 early on Saturday.\n\nStops:\n- Bixby Creek Bridge\n- Pfeiffer Beach\n- Nepenthe for lunch\n\nBring the camera and the wide lens. Sunset around 6:42 PM.',
    updated: Date.now() - 1000 * 60 * 60 * 22,
    folder: 'Notes',
  },
  {
    id: 'n3',
    title: 'Reading list',
    body: 'The Design of Everyday Things — Don Norman\nWays of Seeing — John Berger\nA Philosophy of Software Design — John Ousterhout\n\nThe first two are re-reads. Take notes on affordances and visual hierarchy.',
    updated: Date.now() - 1000 * 60 * 60 * 50,
    folder: 'Notes',
  },
  {
    id: 'n4',
    title: 'Shopping',
    body: 'Coffee beans\nOlive oil\nSourdough\nFlowers for the table\n\n(Market closes at 6.)',
    updated: Date.now() - 1000 * 60 * 60 * 76,
    folder: 'Personal',
  },
]

const STORAGE_KEY = 'macos-notes-v1'

function formatDate(ts: number) {
  const date = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - ts
  if (diff < 1000 * 60 * 60 * 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  if (diff < 1000 * 60 * 60 * 24 * 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Note[]
        if (Array.isArray(parsed) && parsed.length) return parsed
      }
    } catch {
      /* ignore */
    }
    return INITIAL_NOTES
  })
  const [selectedId, setSelectedId] = useState<string>(INITIAL_NOTES[0].id)
  const [query, setQuery] = useState('')
  const [mobileList, setMobileList] = useState(true)
  const [format, setFormat] = useState({ bold: false, italic: false, underline: false })
  const [copied, setCopied] = useState(false)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch {
      /* ignore */
    }
  }, [notes])

  const selected = notes.find((n) => n.id === selectedId) ?? notes[0]

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return [...notes]
      .filter((n) => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
      .sort((a, b) => b.updated - a.updated)
  }, [notes, query])

  const update = (patch: Partial<Note>) => {
    if (!selected) return
    setNotes((prev) =>
      prev.map((n) => (n.id === selected.id ? { ...n, ...patch, updated: Date.now() } : n)),
    )
  }

  const newNote = () => {
    const note: Note = {
      id: `n${Date.now()}`,
      title: '',
      body: '',
      updated: Date.now(),
      folder: 'Notes',
    }
    setNotes((prev) => [note, ...prev])
    setSelectedId(note.id)
    setMobileList(false)
  }

  const deleteNote = () => {
    if (!selected) return
    const remaining = notes.filter((n) => n.id !== selected.id)
    setNotes(remaining)
    if (remaining.length) setSelectedId(remaining[0].id)
  }

  const share = async () => {
    if (!selected) return
    try {
      await navigator.clipboard.writeText(`${selected.title}\n\n${selected.body}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard may be blocked */
    }
  }

  const insertChecklist = () => {
    if (!selected) return
    update({ body: `${selected.body}${selected.body.endsWith('\n') || !selected.body ? '' : '\n'}- [ ] ` })
    bodyRef.current?.focus()
  }

  return (
    <div className="relative flex h-full min-h-0 bg-white text-[#1d1d1f]">
      <aside
        className={`w-full shrink-0 flex-col border-r border-black/[0.08] bg-[#f4f4f2]/90 backdrop-blur-xl md:flex md:w-[232px] ${
          mobileList ? 'flex' : 'hidden'
        }`}
      >
        <div className="flex h-[44px] shrink-0 items-center justify-between px-[12px]">
          <span className="text-[13px] font-bold tracking-[-0.2px]">Notes</span>
          <button
            onClick={newNote}
            aria-label="New note"
            className="grid h-[22px] w-[22px] place-items-center rounded-[5px] text-black/50 hover:bg-black/[0.06]"
          >
            <Plus className="h-[15px] w-[15px]" strokeWidth={2.2} />
          </button>
        </div>
        <div className="px-[9px] pb-[7px]">
          <label className="flex h-[25px] items-center gap-[5px] rounded-[6px] border border-black/[0.08] bg-white/65 px-[7px]">
            <Search className="h-[11px] w-[11px] text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-[11px] outline-none placeholder:text-black/35"
            />
          </label>
        </div>
        <div className="flex items-center justify-between px-[14px] pb-[4px] text-[10px] font-semibold text-black/35">
          <span>iCloud</span>
          <span>{filtered.length}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-[7px] pb-3">
          {filtered.length === 0 && (
            <p className="px-[8px] py-4 text-center text-[11px] text-black/35">No notes found</p>
          )}
          {filtered.map((note) => {
            const active = selected?.id === note.id
            return (
              <button
                key={note.id}
                onClick={() => {
                  setSelectedId(note.id)
                  setMobileList(false)
                }}
                className={`mb-[2px] w-full rounded-[6px] px-[9px] py-[6px] text-left transition-colors ${
                  active ? 'bg-[#ffe9a3]' : 'hover:bg-black/[0.04]'
                }`}
              >
                <p className="truncate text-[11.5px] font-semibold leading-[15px] text-[#2b2b2e]">
                  {note.title || 'New Note'}
                </p>
                <div className="mt-[1px] flex gap-[6px] text-[9.5px] leading-[13px] text-black/40">
                  <span className="shrink-0">{formatDate(note.updated)}</span>
                  <span className="truncate">
                    {note.body.replace(/\n/g, ' ').trim() || 'No additional text'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        <div className="flex h-[26px] shrink-0 items-center gap-[5px] border-t border-black/[0.07] px-[12px] text-[10px] text-black/35">
          <Check className="h-[10px] w-[10px]" />
          Updated just now
        </div>
      </aside>

      <div className={`min-w-0 flex-1 flex-col bg-white ${mobileList ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex h-[38px] shrink-0 items-center gap-[2px] border-b border-black/[0.07] bg-[#fbfbf8] px-[10px]">
          <button
            onClick={() => setMobileList(true)}
            aria-label="Back to notes"
            className="mr-[3px] grid h-[24px] w-[24px] place-items-center rounded-[5px] text-black/50 hover:bg-black/[0.06] md:hidden"
          >
            <ChevronLeft className="h-[15px] w-[15px]" />
          </button>
          <FormatButton active={format.bold} onClick={() => setFormat((f) => ({ ...f, bold: !f.bold }))} label="Bold">
            <Bold className="h-[13px] w-[13px]" strokeWidth={2.2} />
          </FormatButton>
          <FormatButton active={format.italic} onClick={() => setFormat((f) => ({ ...f, italic: !f.italic }))} label="Italic">
            <Italic className="h-[13px] w-[13px]" strokeWidth={2.2} />
          </FormatButton>
          <FormatButton active={format.underline} onClick={() => setFormat((f) => ({ ...f, underline: !f.underline }))} label="Underline">
            <Underline className="h-[13px] w-[13px]" strokeWidth={2.2} />
          </FormatButton>
          <span className="mx-[3px] h-[15px] w-px bg-black/10" />
          <FormatButton onClick={insertChecklist} label="Checklist">
            <CheckSquare className="h-[13px] w-[13px]" strokeWidth={2} />
          </FormatButton>
          <FormatButton onClick={() => { bodyRef.current?.focus(); update({ body: `${selected?.body ?? ''}\n• ` }) }} label="Bulleted list">
            <ListPlus className="h-[13px] w-[13px]" strokeWidth={2} />
          </FormatButton>
          <div className="ml-auto flex items-center gap-[2px]">
            <button
              onClick={share}
              aria-label="Copy note"
              className="grid h-[24px] min-w-[24px] place-items-center rounded-[5px] px-[5px] text-black/45 hover:bg-black/[0.06]"
            >
              {copied ? <span className="text-[10px] font-medium text-[#0a84ff]">Copied</span> : <Share className="h-[13px] w-[13px]" />}
            </button>
            <button
              onClick={deleteNote}
              aria-label="Delete note"
              className="grid h-[24px] w-[24px] place-items-center rounded-[5px] text-black/45 hover:bg-black/[0.06] hover:text-[#ff453a]"
            >
              <Trash2 className="h-[13px] w-[13px]" />
            </button>
          </div>
        </div>

        {selected ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-[26px] pb-16 pt-[16px] sm:px-[38px]">
              <p className="text-center text-[10px] text-black/35">
                {new Date(selected.updated).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                at {new Date(selected.updated).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
              <input
                value={selected.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="New Note"
                className="mt-[12px] w-full select-text bg-transparent text-[20px] font-bold tracking-[-0.4px] outline-none placeholder:text-black/20"
              />
              <textarea
                ref={bodyRef}
                value={selected.body}
                onChange={(e) => update({ body: e.target.value })}
                placeholder="Start writing…"
                spellCheck={false}
                style={{
                  fontWeight: format.bold ? 600 : 400,
                  fontStyle: format.italic ? 'italic' : 'normal',
                  textDecoration: format.underline ? 'underline' : 'none',
                }}
                className="mt-[8px] h-[calc(100%-80px)] min-h-[220px] w-full resize-none select-text bg-transparent text-[13px] leading-[21px] text-[#2b2b2e] outline-none placeholder:text-black/25"
              />
            </div>
            <div className="flex h-[24px] shrink-0 items-center justify-end border-t border-black/[0.06] bg-[#fbfbf8] px-[14px] text-[9.5px] text-black/30">
              {selected.body.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-black/35">
            <ListPlus className="h-[30px] w-[30px]" strokeWidth={1.4} />
            <p className="text-[12px]">No note selected</p>
            <button onClick={newNote} className="rounded-[6px] bg-[#ffd60a] px-[12px] py-[4px] text-[11px] font-semibold text-black/70">
              New Note
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function FormatButton({
  children,
  label,
  onClick,
  active,
}: {
  children: ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`grid h-[24px] w-[25px] place-items-center rounded-[5px] ${
        active ? 'bg-black/10 text-black/70' : 'text-black/45 hover:bg-black/[0.06]'
      }`}
    >
      {children}
    </button>
  )
}
