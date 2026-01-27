export type Platform = 'mac' | 'windows' | 'linux'
export type PlatformPreference = Platform | 'auto'

export interface HotkeyFormatOptions {
  platform: Platform
  showAllAlternatives: boolean
}

const modKeyForPlatform = (platform: Platform): string => (platform === 'mac' ? 'Cmd' : 'Ctrl')

const normalizeToken = (token: string, platform: Platform): string => {
  const trimmed = token.trim()
  const lower = trimmed.toLowerCase()
  const mod = modKeyForPlatform(platform)
  const macSymbols: Record<string, string> = {
    cmd: '⌘',
    command: '⌘',
    meta: '⌘',
    ctrl: '⌃',
    control: '⌃',
    shift: '⇧',
    alt: '⌥',
    option: '⌥',
    opt: '⌥'
  }
  const arrows: Record<string, string> = {
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→'
  }
  const candidates: (string | null)[] = [
    lower.length === 0 ? '' : null,
    lower === 'mod' ? (platform === 'mac' ? '⌘' : 'Ctrl') : null,
    platform === 'mac' && macSymbols[lower] ? macSymbols[lower] : null,
    arrows[lower] ?? null,
    ['cmd', 'command', 'meta'].includes(lower) ? mod : null,
    (lower === 'ctrl' || lower === 'control') ? 'Ctrl' : null,
    lower === 'shift' ? 'Shift' : null,
    (lower === 'alt' || lower === 'option' || lower === 'opt') ? (platform === 'mac' ? 'Option' : 'Alt') : null,
    (lower === 'enter' || lower === 'return') ? 'Enter' : null
  ]
  const resolved = candidates.find((entry) => entry !== null)
  return resolved ?? (lower.length === 1 ? lower.toUpperCase() : trimmed)
}

const formatChord = (rawChord: string, platform: Platform): string => {
  const rawParts = rawChord.split('+').map((part) => part.trim()).filter((part) => part.length > 0)
  const partsLower = rawParts.map((part) => part.toLowerCase())
  const hasOption = partsLower.some((part) => part === 'alt' || part === 'option' || part === 'opt')
  const hasArrow = partsLower.some((part) => part === 'arrowup' || part === 'arrowdown' || part === 'arrowleft' || part === 'arrowright')
  const parts = hasOption && hasArrow ? [] : rawParts.map((part) => normalizeToken(part, platform)).filter((part) => part.length > 0)
  return parts.join(' ')
}

const formatSequence = (rawSequence: string, platform: Platform): string =>
  rawSequence.trim().split(/\s+/).map((step) => formatChord(step, platform)).filter((step) => step.length > 0).join(' ')

export const formatHotkey = (rawHotkey: string, options: HotkeyFormatOptions): string => {
  const alternatives = rawHotkey.split(',').map((entry) => formatSequence(entry, options.platform)).filter((entry) => entry.length > 0)
  const first = alternatives.at(0) ?? ''
  return options.showAllAlternatives ? alternatives.join(' / ') : first
}
