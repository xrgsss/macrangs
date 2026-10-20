export type AppId =
  | 'finder'
  | 'launchpad'
  | 'safari'
  | 'messages'
  | 'mail'
  | 'maps'
  | 'photos'
  | 'camera'
  | 'photobooth'
  | 'facetime'
  | 'calendar'
  | 'contacts'
  | 'reminders'
  | 'notes'
  | 'tv'
  | 'music'
  | 'podcasts'
  | 'news'
  | 'numbers'
  | 'pages'
  | 'appstore'
  | 'settings'
  | 'downloads'
  | 'trash'

export interface WindowInstance {
  id: string
  appId: AppId
  title: string
  z: number
  minimized: boolean
  maximized: boolean
  spawnIndex: number
  folder?: string
  originX: number
  originY: number
}

export interface DesktopFolder {
  id: string
  name: string
  x: number
  y: number
  createdAt?: number
}

export interface WallpaperOption {
  id: string
  name: string
  kind: 'bigsur' | 'graphite' | 'solstice' | 'aurora' | 'dusk'
}

export interface DockSettings {
  autoHide: boolean
  magnification: boolean
  size: number
  position: 'bottom'
}

export type MenuCommand =
  | 'about'
  | 'close'
  | 'minimize'
  | 'zoom'
  | 'mission-control'
  | 'new-finder'
  | 'wallpaper'
  | 'sleep'
  | 'none'
