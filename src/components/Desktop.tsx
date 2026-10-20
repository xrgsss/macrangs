import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import type { AppId, DesktopFolder, DockSettings, WindowInstance } from '../types'
import { APP_META } from '../data/apps'
import { Wallpaper, WALLPAPERS } from './Wallpaper'
import { MenuBar, type MenuCommand } from './MenuBar'
import { Dock } from './Dock'
import { ControlCenter, TRACKS } from './ControlCenter'
import { AppWindow } from './AppWindow'
import { MissionControl } from './MissionControl'
import { ContextMenu, type SortKey } from './ContextMenu'
import { Launchpad } from './Launchpad'
import { Spotlight, type SpotlightAction } from './Spotlight'
import { AppSwitcher } from './AppSwitcher'
import { InfoModal, type InfoModalKind } from './InfoModal'
import { LockScreen, SleepScreen } from './SystemScreens'
import { WallpaperPicker } from './WallpaperPicker'
import { FolderIcon } from './AppIcons'

import { FinderApp } from '../apps/FinderApp'
import { SafariApp } from '../apps/SafariApp'
import { PhotosApp } from '../apps/PhotosApp'
import { CameraApp } from '../apps/CameraApp'
import { PhotoBoothApp } from '../apps/PhotoBoothApp'
import { CalendarApp } from '../apps/CalendarApp'
import { NotesApp } from '../apps/NotesApp'
import { SystemPreferences, type PaneId } from '../apps/SystemPreferences'
import {
  AppStoreApp,
  ContactsApp,
  FaceTimeApp,
  MailApp,
  MapsApp,
  MessagesApp,
  MusicApp,
  NewsApp,
  NumbersApp,
  PagesApp,
  PodcastsApp,
  RemindersApp,
  TVApp,
} from '../apps/OtherApps'

const WALLPAPER_KEY = 'macos-wallpaper-v1'
const DOCK_KEY = 'macos-dock-v1'

const DEFAULT_DOCK: DockSettings = {
  autoHide: false,
  magnification: true,
  size: 52,
  position: 'bottom',
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function loadString(key: string, fallback: string) {
  try {
    return window.localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

function loadDock(): DockSettings {
  try {
    const raw = window.localStorage.getItem(DOCK_KEY)
    if (!raw) return DEFAULT_DOCK
    const parsed = JSON.parse(raw) as Partial<DockSettings>
    return { ...DEFAULT_DOCK, ...parsed, position: 'bottom' }
  } catch {
    return DEFAULT_DOCK
  }
}

function initialWindows(): WindowInstance[] {
  const vw = typeof window === 'undefined' ? 1440 : window.innerWidth
  const vh = typeof window === 'undefined' ? 900 : window.innerHeight
  return [
    {
      id: 'photos',
      appId: 'photos',
      title: 'Photos',
      z: 100,
      minimized: false,
      maximized: false,
      spawnIndex: 0,
      originX: vw / 2,
      originY: vh - 46,
    },
  ]
}

interface InfoState {
  kind: InfoModalKind
  appId?: string
  appName?: string
  subject?: string
}

type ScreenMode = 'sleep' | 'lock' | null

export function Desktop() {
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === 'undefined' ? 1440 : window.innerWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
  }))

  const [wallpaper, setWallpaper] = useState(() => loadString(WALLPAPER_KEY, 'big-sur'))
  const [dockSettings, setDockSettings] = useState<DockSettings>(loadDock)
  const [windows, setWindows] = useState<WindowInstance[]>(initialWindows)
  const [focusedId, setFocusedId] = useState<string | null>('photos')
  const zCounter = useRef(100)

  const [controlCenterOpen, setControlCenterOpen] = useState(false)
  const [missionOpen, setMissionOpen] = useState(false)
  const [missionRects, setMissionRects] = useState<
    Record<string, { x: number; y: number; width: number; height: number }>
  >({})
  const [launchpadOpen, setLaunchpadOpen] = useState(false)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [switcherApps, setSwitcherApps] = useState<AppId[]>(['finder'])
  const [switcherIndex, setSwitcherIndex] = useState(0)
  const [wallpaperPickerOpen, setWallpaperPickerOpen] = useState(false)
  const [infoModal, setInfoModal] = useState<InfoState | null>(null)
  const [screenMode, setScreenMode] = useState<ScreenMode>(null)

  const [folders, setFolders] = useState<DesktopFolder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>('name')

  const [settingsPane, setSettingsPane] = useState<PaneId>('desktop')
  const [settingsSession, setSettingsSession] = useState(0)

  const [wifiOn, setWifiOn] = useState(true)
  const [bluetoothOn, setBluetoothOn] = useState(true)
  const [airdropOn, setAirdropOn] = useState(true)
  const [focusOn, setFocusOn] = useState(false)
  const [brightness, setBrightness] = useState(84)
  const [volume, setVolume] = useState(62)
  const [keyboardBrightness, setKeyboardBrightness] = useState(36)
  const [playing, setPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(WALLPAPER_KEY, wallpaper)
    } catch {
      /* storage can be disabled */
    }
  }, [wallpaper])

  useEffect(() => {
    try {
      window.localStorage.setItem(DOCK_KEY, JSON.stringify(dockSettings))
    } catch {
      /* storage can be disabled */
    }
  }, [dockSettings])

  useEffect(() => {
    setFolders((prev) =>
      prev.map((folder) => ({
        ...folder,
        x: clamp(folder.x, 8, viewport.w - 112),
        y: clamp(folder.y, 38, viewport.h - 150),
      })),
    )
  }, [viewport])

  useEffect(() => {
    if (!controlCenterOpen) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-control-center],[data-cc-trigger]')) setControlCenterOpen(false)
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [controlCenterOpen])

  const activeWindow = windows.find((w) => w.id === focusedId && !w.minimized) ?? null

  const openApps = useMemo(() => {
    const set = new Set<AppId>()
    for (const win of windows) {
      set.add(win.appId)
      if (win.appId === 'finder' && win.folder === 'Downloads') set.add('downloads')
      if (win.appId === 'finder' && win.folder === 'Trash') set.add('trash')
    }
    return set
  }, [windows])

  const dockActive: AppId | null = activeWindow
    ? activeWindow.appId === 'finder' && activeWindow.folder === 'Downloads'
      ? 'downloads'
      : activeWindow.appId === 'finder' && activeWindow.folder === 'Trash'
        ? 'trash'
        : activeWindow.appId
    : null

  const activeAppName = activeWindow ? APP_META[activeWindow.appId].name : 'Finder'
  const wallpaperName = WALLPAPERS.find((w) => w.id === wallpaper)?.name ?? 'Big Sur'

  const topWindow = useCallback(
    (list: WindowInstance[], excludeId?: string) =>
      list
        .filter((w) => w.id !== excludeId && !w.minimized)
        .sort((a, b) => b.z - a.z)[0] ?? null,
    [],
  )

  const focusWindow = useCallback((id: string) => {
    setFocusedId(id)
    setWindows((prev) => {
      const win = prev.find((w) => w.id === id)
      if (!win) return prev
      const maxZ = prev.reduce((max, w) => Math.max(max, w.z), 0)
      if (win.z === maxZ) return prev
      return prev.map((w) => (w.id === id ? { ...w, z: ++zCounter.current } : w))
    })
  }, [])

  const openApp = useCallback(
    (appId: AppId, origin?: { x: number; y: number }, folder?: string) => {
      setControlCenterOpen(false)
      setContextMenu(null)
      setSpotlightOpen(false)
      setSwitcherOpen(false)

      if (appId === 'launchpad') {
        setLaunchpadOpen(true)
        return
      }

      const targetApp: AppId = appId === 'downloads' || appId === 'trash' ? 'finder' : appId
      const targetFolder =
        folder ?? (appId === 'downloads' ? 'Downloads' : appId === 'trash' ? 'Trash' : undefined)
      const fallbackTitle = targetFolder ?? APP_META[targetApp].name
      const vw = window.innerWidth
      const vh = window.innerHeight
      const spawnOrigin = origin ?? { x: vw / 2, y: vh - 46 }
      const z = ++zCounter.current

      setWindows((prev) => {
        const existing = prev.find((w) => w.appId === targetApp)
        if (existing) {
          return prev.map((w) =>
            w.id === existing.id
              ? {
                  ...w,
                  minimized: false,
                  folder: targetFolder ?? w.folder,
                  title: targetFolder ?? w.title,
                  z,
                }
              : w,
          )
        }
        return [
          ...prev,
          {
            id: targetApp,
            appId: targetApp,
            title: fallbackTitle,
            z,
            minimized: false,
            maximized: false,
            spawnIndex: prev.length,
            folder: targetFolder,
            originX: spawnOrigin.x,
            originY: spawnOrigin.y,
          },
        ]
      })
      setFocusedId(targetApp)
      setLaunchpadOpen(false)
    },
    [],
  )

  const closeWindow = useCallback(
    (id: string) => {
      setWindows((prev) => prev.filter((w) => w.id !== id))
      setFocusedId((current) => (current === id ? topWindow(windows, id)?.id ?? null : current))
    },
    [topWindow, windows],
  )

  const minimizeWindow = useCallback(
    (id: string) => {
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)))
      setFocusedId((current) =>
        current === id ? topWindow(windows.filter((w) => w.id !== id), id)?.id ?? null : current,
      )
    },
    [topWindow, windows],
  )

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)))
  }, [])

  const createDesktopFolder = useCallback(
    (at?: { x: number; y: number }) => {
      const names = new Set(folders.map((f) => f.name))
      let name = 'Untitled Folder'
      let n = 2
      while (names.has(name)) {
        name = `Untitled Folder ${n++}`
      }
      const count = folders.length
      const x = at
        ? clamp(at.x - 38, 8, viewport.w - 112)
        : clamp(viewport.w - 122 - Math.floor(count / 5) * 108, 8, viewport.w - 112)
      const y = at ? clamp(at.y - 24, 38, viewport.h - 150) : 48 + (count % 5) * 98
      const folder: DesktopFolder = {
        id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name,
        x,
        y,
        createdAt: Date.now(),
      }
      setFolders((prev) => [...prev, folder])
      setSelectedFolder(folder.id)
      setFocusedId(null)
      setContextMenu(null)
    },
    [folders, viewport],
  )

  const openDesktopFolder = useCallback(
    (folder: DesktopFolder) => {
      setSelectedFolder(folder.id)
      openApp('finder', { x: folder.x + 40, y: folder.y + 38 }, folder.name)
    },
    [openApp],
  )

  const sortFolders = useCallback(
    (key: SortKey) => {
      setSortBy(key)
      setContextMenu(null)
      setFolders((prev) => {
        const sorted = [...prev].sort((a, b) => {
          if (key === 'name') return a.name.localeCompare(b.name)
          if (key === 'date') return (b.createdAt ?? 0) - (a.createdAt ?? 0)
          if (key === 'kind') return a.name.localeCompare(b.name)
          return a.name.localeCompare(b.name)
        })
        const rows = Math.max(1, Math.floor((viewport.h - 130) / 98))
        return sorted.map((folder, i) => ({
          ...folder,
          x: clamp(viewport.w - 118 - Math.floor(i / rows) * 108, 8, viewport.w - 112),
          y: 44 + (i % rows) * 98,
        }))
      })
    },
    [viewport],
  )

  const openSystemPane = useCallback(
    (pane: PaneId) => {
      setSettingsPane(pane)
      setSettingsSession((s) => s + 1)
      openApp('settings')
    },
    [openApp],
  )

  const captureRects = () => {
    const rects: Record<string, { x: number; y: number; width: number; height: number }> = {}
    document.querySelectorAll<HTMLElement>('[data-window-id]').forEach((el) => {
      const id = el.dataset.windowId
      if (!id) return
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        rects[id] = { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      }
    })
    return rects
  }

  const toggleMission = useCallback(() => {
    if (missionOpen) {
      setMissionOpen(false)
      return
    }
    setMissionRects(captureRects())
    setMissionOpen(true)
    setControlCenterOpen(false)
    setContextMenu(null)
    setSpotlightOpen(false)
    setLaunchpadOpen(false)
    setInfoModal(null)
  }, [missionOpen])

  const selectMissionWindow = (id: string) => {
    setMissionOpen(false)
    setFocusedId(id)
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: false, z: ++zCounter.current } : w)),
    )
  }

  const handleCommand = (command: MenuCommand, menuId?: string) => {
    switch (command) {
      case 'about':
        if (menuId === 'apple') {
          setInfoModal({ kind: 'about-mac' })
        } else if (activeWindow) {
          setInfoModal({
            kind: 'about-app',
            appId: activeWindow.appId,
            appName: APP_META[activeWindow.appId].name,
          })
        } else {
          setInfoModal({ kind: 'about-mac' })
        }
        break
      case 'settings':
        openApp('settings')
        break
      case 'appstore':
        openApp('appstore')
        break
      case 'sleep':
        setControlCenterOpen(false)
        setScreenMode('sleep')
        break
      case 'lock':
        setControlCenterOpen(false)
        setScreenMode('lock')
        break
      case 'close':
        if (activeWindow) closeWindow(activeWindow.id)
        break
      case 'minimize':
        if (activeWindow) minimizeWindow(activeWindow.id)
        break
      case 'zoom':
        if (activeWindow) toggleMaximize(activeWindow.id)
        break
      case 'new-finder':
        openApp('finder')
        break
      case 'new-folder':
        createDesktopFolder()
        break
      case 'mission':
        toggleMission()
        break
      case 'control-center':
        setControlCenterOpen((v) => !v)
        break
      case 'wallpaper':
        setWallpaperPickerOpen(true)
        break
      case 'help':
        setInfoModal({ kind: 'help' })
        break
      case 'search':
        setSpotlightOpen(true)
        break
      default:
        break
    }
  }

  const handleSpotlightAction = useCallback(
    (action: SpotlightAction) => {
      setSpotlightOpen(false)
      if (action === 'wallpaper') setWallpaperPickerOpen(true)
      else if (action === 'mission') toggleMission()
      else if (action === 'settings') openApp('settings')
      else if (action === 'sleep') setScreenMode('sleep')
      else if (action === 'lock') setScreenMode('lock')
    },
    [openApp, toggleMission],
  )

  const openFromSwitcher = useCallback(
    (appId: AppId) => {
      setSwitcherOpen(false)
      openApp(appId)
    },
    [openApp],
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (screenMode) {
        if (screenMode === 'sleep') setScreenMode(null)
        return
      }

      const target = e.target as HTMLElement | null
      const typing =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)

      const mod = e.metaKey || e.ctrlKey

      if (mod && e.code === 'Space') {
        e.preventDefault()
        setSpotlightOpen((v) => !v)
        setControlCenterOpen(false)
        setContextMenu(null)
        return
      }

      if (mod && e.key === 'Tab') {
        e.preventDefault()
        const recent = windows
          .filter((w) => !w.minimized)
          .sort((a, b) => b.z - a.z)
          .map((w) => w.appId)
        const base = Array.from(new Set<AppId>([...recent, 'finder']))
        if (!switcherOpen) {
          setSwitcherApps(base)
          setSwitcherIndex(base.length > 1 ? (e.shiftKey ? base.length - 1 : 1) : 0)
          setSwitcherOpen(true)
        } else {
          setSwitcherIndex((i) =>
            (i + (e.shiftKey ? -1 : 1) + switcherApps.length) % switcherApps.length,
          )
        }
        return
      }

      if (mod && e.key.toLowerCase() === 'w' && !typing) {
        e.preventDefault()
        if (activeWindow) closeWindow(activeWindow.id)
        return
      }

      if (mod && e.key.toLowerCase() === 'm' && !typing) {
        e.preventDefault()
        if (activeWindow) minimizeWindow(activeWindow.id)
        return
      }

      if (e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault()
        toggleMission()
        return
      }

      if (e.key === 'Escape') {
        if (switcherOpen) {
          setSwitcherOpen(false)
          return
        }
        if (infoModal) {
          setInfoModal(null)
          return
        }
        if (wallpaperPickerOpen) {
          setWallpaperPickerOpen(false)
          return
        }
        if (spotlightOpen) {
          setSpotlightOpen(false)
          return
        }
        if (launchpadOpen) {
          setLaunchpadOpen(false)
          return
        }
        if (missionOpen) {
          setMissionOpen(false)
          return
        }
        if (controlCenterOpen) {
          setControlCenterOpen(false)
          return
        }
        if (contextMenu) {
          setContextMenu(null)
          return
        }
        if (selectedFolder) {
          setSelectedFolder(null)
          return
        }
        if (focusedId) setFocusedId(null)
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if ((e.key === 'Meta' || e.key === 'Control') && switcherOpen) {
        const appId = switcherApps[switcherIndex]
        setSwitcherOpen(false)
        if (appId) openApp(appId)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [
    activeWindow,
    closeWindow,
    contextMenu,
    controlCenterOpen,
    focusedId,
    infoModal,
    launchpadOpen,
    minimizeWindow,
    missionOpen,
    openApp,
    screenMode,
    selectedFolder,
    spotlightOpen,
    switcherApps,
    switcherIndex,
    switcherOpen,
    toggleMission,
    wallpaperPickerOpen,
    windows,
  ])

  const handleDockOpen = (appId: AppId, rect: DOMRect) => {
    openApp(appId, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setSelectedFolder(null)
  }

  const handleDesktopPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    setFocusedId(null)
    setSelectedFolder(null)
    setContextMenu(null)
  }

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setFocusedId(null)
    setSelectedFolder(null)
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const renderApp = (win: WindowInstance) => {
    switch (win.appId) {
      case 'finder':
        return (
          <FinderApp
            key={win.folder ?? 'Recents'}
            initialFolder={win.folder ?? 'Recents'}
            onOpenApp={(id) => openApp(id)}
            onNewFolder={() => createDesktopFolder()}
          />
        )
      case 'safari':
        return <SafariApp />
      case 'photos':
        return <PhotosApp />
      case 'camera':
        return <CameraApp />
      case 'photobooth':
        return <PhotoBoothApp />
      case 'calendar':
        return <CalendarApp />
      case 'notes':
        return <NotesApp />
      case 'settings':
        return (
          <SystemPreferences
            key={`settings-${settingsSession}`}
            wallpaper={wallpaper}
            onWallpaperChange={setWallpaper}
            dockSettings={dockSettings}
            onDockSettings={(patch) => setDockSettings((prev) => ({ ...prev, ...patch }))}
            brightness={brightness}
            volume={volume}
            onBrightness={setBrightness}
            onVolume={setVolume}
            onMissionControl={toggleMission}
            initialPane={settingsPane}
          />
        )
      case 'messages':
        return <MessagesApp />
      case 'mail':
        return <MailApp />
      case 'maps':
        return <MapsApp />
      case 'facetime':
        return <FaceTimeApp />
      case 'contacts':
        return <ContactsApp />
      case 'reminders':
        return <RemindersApp />
      case 'tv':
        return <TVApp />
      case 'music':
        return (
          <MusicApp
            trackIndex={trackIndex}
            playing={playing}
            onTogglePlay={() => setPlaying((v) => !v)}
            onNext={() => setTrackIndex((i) => (i + 1) % TRACKS.length)}
            onPrev={() => setTrackIndex((i) => (i + TRACKS.length - 1) % TRACKS.length)}
            onSelectTrack={(i) => {
              setTrackIndex(i)
              setPlaying(true)
            }}
          />
        )
      case 'podcasts':
        return <PodcastsApp />
      case 'news':
        return <NewsApp />
      case 'numbers':
        return <NumbersApp />
      case 'pages':
        return <PagesApp />
      case 'appstore':
        return <AppStoreApp />
      default:
        return (
          <div className="flex h-full items-center justify-center bg-[#f6f6f8] text-[12px] text-black/35">
            This app is not available.
          </div>
        )
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative h-screen w-screen overflow-hidden bg-[#08111f]">
        <div
          className="absolute inset-0 select-none"
          onPointerDown={handleDesktopPointerDown}
          onContextMenu={handleDesktopContextMenu}
        >
          <Wallpaper variant={wallpaper} className="absolute inset-0 h-full w-full" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.16) 100%)',
            }}
          />

          {folders.map((folder) => {
            const selected = selectedFolder === folder.id
            return (
              <button
                key={folder.id}
                data-desktop-folder
                onPointerDown={(e) => {
                  if (e.button !== 0) return
                  e.stopPropagation()
                  setSelectedFolder(folder.id)
                  setFocusedId(null)
                  setContextMenu(null)
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  openDesktopFolder(folder)
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectedFolder(folder.id)
                  setFocusedId(null)
                  setContextMenu({ x: e.clientX, y: e.clientY })
                }}
                className="absolute flex w-[96px] flex-col items-center gap-[3px] rounded-[6px] px-[4px] pb-[4px] pt-[2px] outline-none"
                style={{ left: folder.x, top: folder.y }}
              >
                <FolderIcon className="h-[58px] w-[58px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
                <span
                  className={`max-w-full break-words rounded-[4px] px-[5px] py-[1px] text-center text-[11px] font-medium leading-[14px] ${
                    selected
                      ? 'bg-[#0a84ff] text-white shadow-sm'
                      : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]'
                  }`}
                >
                  {folder.name}
                </span>
              </button>
            )
          })}
        </div>

        <div className="pointer-events-none absolute inset-0 z-[10]">
          <AnimatePresence>
            {windows.map((win) => (
              <AppWindow
                key={win.id}
                win={win}
                active={focusedId === win.id && !win.minimized}
                onFocus={focusWindow}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onToggleMaximize={toggleMaximize}
              >
                {renderApp(win)}
              </AppWindow>
            ))}
          </AnimatePresence>
        </div>

        <Dock
          openApps={openApps}
          activeApp={dockActive}
          settings={dockSettings}
          onOpen={handleDockOpen}
        />

        <MenuBar
          activeAppName={activeAppName}
          onCommand={handleCommand}
          onOpenControlCenter={() => setControlCenterOpen((v) => !v)}
          controlCenterOpen={controlCenterOpen}
          onToggleMissionControl={toggleMission}
          hasActiveWindow={!!activeWindow}
          wifiOn={wifiOn}
        />

        <AnimatePresence>
          {controlCenterOpen && (
            <ControlCenter
              wifiOn={wifiOn}
              bluetoothOn={bluetoothOn}
              airdropOn={airdropOn}
              focusOn={focusOn}
              brightness={brightness}
              volume={volume}
              keyboardBrightness={keyboardBrightness}
              playing={playing}
              trackIndex={trackIndex}
              onToggleWifi={() => setWifiOn((v) => !v)}
              onToggleBluetooth={() => setBluetoothOn((v) => !v)}
              onToggleAirdrop={() => setAirdropOn((v) => !v)}
              onToggleFocus={() => setFocusOn((v) => !v)}
              onBrightness={setBrightness}
              onVolume={setVolume}
              onKeyboardBrightness={setKeyboardBrightness}
              onTogglePlay={() => setPlaying((v) => !v)}
              onNextTrack={() => setTrackIndex((i) => (i + 1) % TRACKS.length)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {launchpadOpen && (
            <Launchpad
              onOpenApp={(appId) => {
                setLaunchpadOpen(false)
                openApp(appId)
              }}
              onClose={() => setLaunchpadOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {missionOpen && (
            <MissionControl
              windows={windows}
              rects={missionRects}
              viewport={viewport}
              onSelect={selectMissionWindow}
              onClose={() => setMissionOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              sortBy={sortBy}
              viewport={viewport}
              onClose={() => setContextMenu(null)}
              onNewFolder={() =>
                createDesktopFolder({ x: contextMenu.x + 10, y: contextMenu.y + 10 })
              }
              onChangeWallpaper={() => setWallpaperPickerOpen(true)}
              onSort={sortFolders}
              onDesktopSettings={() => openSystemPane('desktop')}
              onGetInfo={() =>
                setInfoModal({
                  kind: 'info',
                  subject: folders.find((f) => f.id === selectedFolder)?.name,
                })
              }
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {wallpaperPickerOpen && (
            <WallpaperPicker
              current={wallpaper}
              onSelect={setWallpaper}
              onClose={() => setWallpaperPickerOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {spotlightOpen && (
            <Spotlight
              onClose={() => setSpotlightOpen(false)}
              onOpenApp={(appId) => openApp(appId)}
              onAction={handleSpotlightAction}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {infoModal && (
            <InfoModal
              kind={infoModal.kind}
              appId={infoModal.appId}
              appName={infoModal.appName}
              subject={infoModal.subject}
              folderCount={folders.length}
              wallpaperName={wallpaperName}
              onClose={() => setInfoModal(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {switcherOpen && (
            <AppSwitcher
              apps={switcherApps}
              index={switcherIndex}
              onSelect={openFromSwitcher}
              onClose={() => setSwitcherOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {screenMode === 'sleep' && (
            <SleepScreen key="sleep" onWake={() => setScreenMode(null)} />
          )}
          {screenMode === 'lock' && (
            <LockScreen
              key="lock"
              wallpaper={wallpaper}
              onUnlock={() => setScreenMode(null)}
            />
          )}
        </AnimatePresence>

        <div
          className="pointer-events-none fixed inset-0 z-[9950] bg-black transition-opacity duration-200"
          style={{ opacity: clamp((100 - brightness) / 100, 0, 1) * 0.5 }}
        />
      </div>
    </MotionConfig>
  )
}
