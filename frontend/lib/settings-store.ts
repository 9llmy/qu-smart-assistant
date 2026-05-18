export type FontSize = 'small' | 'default' | 'large'

export interface Settings {
  fontSize: FontSize
}

export const defaultSettings: Settings = {
  fontSize: 'default',
}

export function saveSettings(settings: Settings): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('qu-settings', JSON.stringify(settings))
  }
}

export function loadSettings(): Settings {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('qu-settings')
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) }
    }
  }
  return defaultSettings
}

export function getFontSizeClass(fontSize: FontSize): string {
  switch (fontSize) {
    case 'small':
      return 'text-sm'
    case 'large':
      return 'text-lg'
    default:
      return 'text-base'
  }
}

export function applyGlobalFontSize(fontSize: FontSize): void {
  if (typeof document !== 'undefined') {
    const html = document.documentElement
    // Remove all font size classes first
    html.classList.remove('font-size-small', 'font-size-default', 'font-size-large')
    // Add the appropriate class
    html.classList.add(`font-size-${fontSize}`)
  }
}
