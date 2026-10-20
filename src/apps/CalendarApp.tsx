import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface CalendarDef {
  id: string
  name: string
  color: string
}

const CALENDARS: CalendarDef[] = [
  { id: 'home', name: 'Home', color: '#ff5f57' },
  { id: 'work', name: 'Work', color: '#0a84ff' },
  { id: 'birthdays', name: 'Birthdays', color: '#3ed37b' },
  { id: 'travel', name: 'Travel', color: '#ff9f43' },
  { id: 'holidays', name: 'US Holidays', color: '#9b59d0' },
]

interface CalEvent {
  day: number
  title: string
  calendar: string
  time?: string
}

const EVENTS: CalEvent[] = [
  { day: 1, title: 'Monthly planning', calendar: 'work', time: '9:00 AM' },
  { day: 2, title: 'Yoga class', calendar: 'home', time: '7:30 AM' },
  { day: 5, title: 'Dinner with Sam', calendar: 'home', time: '7:00 PM' },
  { day: 7, title: 'Design review', calendar: 'work', time: '10:30 AM' },
  { day: 9, title: 'Dentist', calendar: 'home', time: '2:15 PM' },
  { day: 12, title: 'Team offsite', calendar: 'work', time: 'All day' },
  { day: 13, title: 'Ana’s birthday', calendar: 'birthdays', time: 'All day' },
  { day: 15, title: 'Flight to SFO', calendar: 'travel', time: '6:40 AM' },
  { day: 16, title: 'Hotel check-in', calendar: 'travel' },
  { day: 18, title: 'Columbus Day', calendar: 'holidays' },
  { day: 20, title: 'Product sync', calendar: 'work', time: '11:00 AM' },
  { day: 21, title: 'Grocery run', calendar: 'home', time: '6:00 PM' },
  { day: 23, title: 'Quarterly review', calendar: 'work', time: '3:00 PM' },
  { day: 25, title: 'Weekend hike', calendar: 'home', time: '8:00 AM' },
  { day: 27, title: 'Sprint kickoff', calendar: 'work', time: '9:30 AM' },
  { day: 29, title: 'Halloween prep', calendar: 'home' },
]

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export function CalendarApp() {
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<Date>(today)
  const [mode, setMode] = useState<'Month' | 'Year'>('Month')
  const [visible, setVisible] = useState<Set<string>>(
    () => new Set(CALENDARS.map((c) => c.id)),
  )
  const [query, setQuery] = useState('')

  const grid = useMemo(() => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])

  const eventsFor = (date: Date) => {
    if (date.getMonth() !== cursor.getMonth() || date.getFullYear() !== cursor.getFullYear()) return []
    return EVENTS.filter(
      (e) =>
        e.day === date.getDate() &&
        visible.has(e.calendar) &&
        (!query || e.title.toLowerCase().includes(query.toLowerCase())),
    )
  }

  const shift = (delta: number) => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1))
  }

  const goToday = () => {
    const now = new Date()
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelected(now)
  }

  const toggleCalendar = (id: string) => {
    setVisible((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex h-full min-h-0 bg-white text-[#1d1d1f]">
      <aside className="hidden w-[196px] shrink-0 flex-col overflow-y-auto border-r border-black/[0.07] bg-[#f2f3f5]/85 px-[9px] pb-4 pt-[11px] backdrop-blur-xl md:flex">
        <div className="mb-[12px] flex items-center justify-between px-[5px]">
          <span className="text-[13px] font-bold tracking-[-0.15px]">Calendar</span>
          <button className="grid h-[20px] w-[20px] place-items-center rounded-[5px] text-[#0a84ff] hover:bg-black/[0.06]" aria-label="New calendar">
            <Plus className="h-[14px] w-[14px]" strokeWidth={2.4} />
          </button>
        </div>
        <label className="mb-[12px] flex h-[24px] items-center gap-[5px] rounded-[6px] border border-black/[0.08] bg-white/60 px-[6px]">
          <Search className="h-[11px] w-[11px] text-black/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[11px] outline-none placeholder:text-black/35"
          />
        </label>
        <div className="mb-[4px] px-[6px] text-[10px] font-semibold uppercase tracking-wide text-black/35">
          iCloud
        </div>
        {CALENDARS.map((cal) => (
          <button
            key={cal.id}
            onClick={() => toggleCalendar(cal.id)}
            className="flex h-[25px] items-center gap-[7px] rounded-[5px] px-[6px] text-left text-[11.5px] hover:bg-black/[0.045]"
          >
            <span
              className="grid h-[11px] w-[11px] shrink-0 place-items-center rounded-[3px] border"
              style={{
                background: visible.has(cal.id) ? cal.color : 'transparent',
                borderColor: visible.has(cal.id) ? cal.color : 'rgba(0,0,0,0.25)',
              }}
            >
              {visible.has(cal.id) && (
                <svg viewBox="0 0 10 10" className="h-[7px] w-[7px]">
                  <path d="M2 5.2L4.1 7.2L8 2.8" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="truncate text-[#333336]">{cal.name}</span>
          </button>
        ))}
        <div className="mb-[4px] mt-[16px] px-[6px] text-[10px] font-semibold uppercase tracking-wide text-black/35">
          Other
        </div>
        <button className="flex h-[25px] items-center gap-[7px] rounded-[5px] px-[6px] text-left text-[11.5px] hover:bg-black/[0.045]">
          <span className="h-[11px] w-[11px] rounded-[3px] bg-[#c7c7cc]" />
          <span className="text-[#333336]">Birthdays</span>
        </button>

        <div className="mt-auto pt-4">
          <div className="rounded-[7px] border border-black/[0.06] bg-white/60 p-[9px]">
            <p className="text-[10px] font-semibold text-black/45">Up next</p>
            <p className="mt-[5px] text-[11px] font-medium leading-[15px]">Product sync</p>
            <p className="mt-[2px] text-[10px] text-black/40">Monday, 11:00 AM</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[52px] shrink-0 items-center gap-[9px] border-b border-black/[0.07] bg-[#fbfbfd]/90 px-[14px] backdrop-blur-xl">
          <div className="flex items-center">
            <button
              onClick={() => shift(-1)}
              aria-label="Previous month"
              className="grid h-[25px] w-[25px] place-items-center rounded-[5px] text-black/55 hover:bg-black/[0.06]"
            >
              <ChevronLeft className="h-[16px] w-[16px]" strokeWidth={2.2} />
            </button>
            <button
              onClick={() => shift(1)}
              aria-label="Next month"
              className="grid h-[25px] w-[25px] place-items-center rounded-[5px] text-black/55 hover:bg-black/[0.06]"
            >
              <ChevronRight className="h-[16px] w-[16px]" strokeWidth={2.2} />
            </button>
          </div>
          <button
            onClick={goToday}
            className="rounded-[6px] border border-black/[0.1] bg-white px-[9px] py-[2px] text-[11px] font-medium text-black/60 shadow-sm hover:bg-black/[0.03]"
          >
            Today
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-[16px] font-bold tracking-[-0.3px]">
              {mode === 'Year' ? cursor.getFullYear() : `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-[5px]">
            <div className="flex items-center rounded-[6px] border border-black/[0.08] bg-black/[0.04] p-[2px]">
              {(['Month', 'Year'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-[4px] px-[9px] py-[2px] text-[10.5px] font-medium ${
                    mode === m ? 'bg-white text-black/75 shadow-sm' : 'text-black/45 hover:text-black/65'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <span className="hidden text-[10.5px] text-black/40 sm:block">
              {selected.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {mode === 'Month' ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="grid grid-cols-7 border-b border-black/[0.07] bg-[#fbfbfd]">
              {WEEKDAYS.map((d, i) => (
                <div
                  key={d}
                  className={`py-[5px] text-center text-[9.5px] font-semibold tracking-[0.04em] ${
                    i === 0 || i === 6 ? 'text-black/30' : 'text-black/40'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
              {grid.map((date, i) => {
                const inMonth = date.getMonth() === cursor.getMonth()
                const isToday = sameDay(date, today)
                const isSelected = sameDay(date, selected)
                const dayEvents = eventsFor(date)
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(date)}
                    className={`relative flex min-h-0 flex-col items-stretch border-b border-r border-black/[0.07] px-[4px] pb-[2px] pt-[3px] text-left transition-colors ${
                      inMonth ? 'bg-white hover:bg-black/[0.025]' : 'bg-[#fafafa] hover:bg-black/[0.02]'
                    } ${i % 7 === 6 ? 'border-r-0' : ''} ${i >= 35 ? 'border-b-0' : ''}`}
                  >
                    <div className="flex justify-center">
                      <span
                        className={`grid h-[19px] min-w-[19px] place-items-center rounded-full px-[4px] text-[11px] font-medium tabular-nums ${
                          isToday
                            ? 'bg-[#ff453a] text-white'
                            : isSelected
                              ? 'bg-[#0a84ff] text-white'
                              : inMonth
                                ? 'text-[#333336]'
                                : 'text-black/25'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    </div>
                    <div className="mt-[1px] min-h-0 space-y-[2px] overflow-hidden">
                      {dayEvents.slice(0, 3).map((ev) => {
                        const cal = CALENDARS.find((c) => c.id === ev.calendar)
                        return (
                          <span
                            key={ev.title}
                            className="block truncate rounded-[2px] px-[3px] py-[1px] text-[8.5px] font-medium leading-[11px] text-white"
                            style={{ background: cal?.color ?? '#999' }}
                          >
                            {ev.title}
                          </span>
                        )
                      })}
                      {dayEvents.length > 3 && (
                        <span className="block px-[3px] text-[8.5px] text-black/40">+{dayEvents.length - 3} more</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#fbfbfd] p-[16px]">
            <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-3 lg:grid-cols-4">
              {MONTHS.map((m, mi) => {
                const mini = buildMonthGrid(cursor.getFullYear(), mi)
                return (
                  <button
                    key={m}
                    onClick={() => {
                      setCursor(new Date(cursor.getFullYear(), mi, 1))
                      setMode('Month')
                    }}
                    className="rounded-[9px] border border-black/[0.07] bg-white p-[10px] text-left shadow-sm transition-shadow hover:shadow-md"
                  >
                    <p className="mb-[6px] text-[11px] font-semibold text-[#ff453a]">{m}</p>
                    <div className="grid grid-cols-7 gap-y-[2px]">
                      {mini.map((d, di) => {
                        const inMonth = d.getMonth() === mi
                        const hasEvent = inMonth && EVENTS.some((e) => e.day === d.getDate() && visible.has(e.calendar))
                        return (
                          <span
                            key={di}
                            className={`relative grid h-[15px] place-items-center text-[8px] tabular-nums ${
                              sameDay(d, today)
                                ? 'mx-auto h-[14px] w-[14px] rounded-full bg-[#ff453a] font-semibold text-white'
                                : inMonth
                                  ? 'text-black/60'
                                  : 'text-black/15'
                            }`}
                          >
                            {d.getDate()}
                            {hasEvent && inMonth && !sameDay(d, today) && (
                              <span className="absolute bottom-[1px] h-[2px] w-[2px] rounded-full bg-[#0a84ff]" />
                            )}
                          </span>
                        )
                      })}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
