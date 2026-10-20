import type { AppId } from '../types'

export interface AppMeta {
  id: AppId
  name: string
  shortName?: string
  width: number
  height: number
  minWidth?: number
  minHeight?: number
  description?: string
  chrome?: 'light' | 'dark'
}

export const APP_META: Record<AppId, AppMeta> = {
  finder: { id: 'finder', name: 'Finder', width: 880, height: 560, minWidth: 540, minHeight: 340 },
  launchpad: { id: 'launchpad', name: 'Launchpad', width: 760, height: 540 },
  safari: { id: 'safari', name: 'Safari', width: 980, height: 640, minWidth: 600, minHeight: 380 },
  messages: { id: 'messages', name: 'Messages', width: 800, height: 560, minWidth: 560, minHeight: 380 },
  mail: { id: 'mail', name: 'Mail', width: 940, height: 600, minWidth: 640, minHeight: 400 },
  maps: { id: 'maps', name: 'Maps', width: 880, height: 580, minWidth: 560, minHeight: 380 },
  photos: { id: 'photos', name: 'Photos', width: 1020, height: 660, minWidth: 640, minHeight: 420 },
  camera: { id: 'camera', name: 'Camera', width: 860, height: 600, minWidth: 540, minHeight: 420 },
  photobooth: {
    id: 'photobooth',
    name: 'Photo Booth',
    width: 840,
    height: 640,
    minWidth: 540,
    minHeight: 420,
    chrome: 'dark',
  },
  facetime: { id: 'facetime', name: 'FaceTime', width: 640, height: 460, minWidth: 480, minHeight: 360 },
  calendar: { id: 'calendar', name: 'Calendar', width: 940, height: 620, minWidth: 640, minHeight: 420 },
  contacts: { id: 'contacts', name: 'Contacts', width: 820, height: 560, minWidth: 560, minHeight: 380 },
  reminders: { id: 'reminders', name: 'Reminders', width: 760, height: 520, minWidth: 520, minHeight: 360 },
  notes: { id: 'notes', name: 'Notes', width: 880, height: 580, minWidth: 600, minHeight: 380 },
  tv: { id: 'tv', name: 'TV', width: 960, height: 620, minWidth: 640, minHeight: 400 },
  music: { id: 'music', name: 'Music', width: 940, height: 600, minWidth: 640, minHeight: 400 },
  podcasts: { id: 'podcasts', name: 'Podcasts', width: 900, height: 580, minWidth: 620, minHeight: 380 },
  news: { id: 'news', name: 'News', width: 940, height: 600, minWidth: 640, minHeight: 400 },
  numbers: { id: 'numbers', name: 'Numbers', width: 900, height: 600, minWidth: 620, minHeight: 400 },
  pages: { id: 'pages', name: 'Pages', width: 900, height: 600, minWidth: 620, minHeight: 400 },
  appstore: { id: 'appstore', name: 'App Store', width: 940, height: 620, minWidth: 640, minHeight: 420 },
  settings: { id: 'settings', name: 'System Preferences', width: 880, height: 600, minWidth: 620, minHeight: 420 },
  downloads: { id: 'downloads', name: 'Downloads', width: 800, height: 520 },
  trash: { id: 'trash', name: 'Trash', width: 800, height: 520 },
}

export const DOCK_ORDER: AppId[] = [
  'finder',
  'launchpad',
  'safari',
  'messages',
  'mail',
  'maps',
  'photos',
  'camera',
  'photobooth',
  'facetime',
  'calendar',
  'contacts',
  'reminders',
  'notes',
  'tv',
  'music',
  'podcasts',
  'news',
  'numbers',
  'pages',
  'appstore',
  'settings',
  'downloads',
  'trash',
]

export function visibleDockApps(width: number): AppId[] {
  if (width < 560) {
    return ['finder', 'launchpad', 'safari', 'messages', 'photos', 'camera', 'photobooth', 'notes', 'music', 'settings', 'downloads', 'trash']
  }
  if (width < 820) {
    return [
      'finder',
      'launchpad',
      'safari',
      'messages',
      'mail',
      'photos',
      'camera',
      'photobooth',
      'calendar',
      'notes',
      'music',
      'settings',
      'downloads',
      'trash',
    ]
  }
  if (width < 1100) {
    return [
      'finder',
      'launchpad',
      'safari',
      'messages',
      'mail',
      'maps',
      'photos',
      'camera',
      'photobooth',
      'facetime',
      'calendar',
      'notes',
      'tv',
      'music',
      'podcasts',
      'settings',
      'downloads',
      'trash',
    ]
  }
  return DOCK_ORDER
}
