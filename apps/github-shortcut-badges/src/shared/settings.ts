import { readLocal, subscribeLocal, writeLocal } from './storage'
import type { Platform, PlatformPreference } from './hotkeyFormat'

export type BadgeSize = 'sm' | 'md' | 'lg'

export interface Settings {
  platformPreference: PlatformPreference
  showAllAlternatives: boolean
  badgeSize: BadgeSize
}

export interface ResolvedSettings extends Settings {
  platform: Platform
}

export const defaultSettings: Settings = {
  platformPreference: 'auto',
  showAllAlternatives: false,
  badgeSize: 'md'
}

const settingsKey = 'ghskSettings'

const validPreference = (value: unknown): PlatformPreference =>
  value === 'mac' || value === 'windows' || value === 'linux' || value === 'auto' ? value : defaultSettings.platformPreference

const validBadgeSize = (value: unknown): BadgeSize =>
  value === 'sm' || value === 'lg' || value === 'md' ? value : defaultSettings.badgeSize

const coerceBoolean = (value: unknown): boolean => (value === true || value === false ? value : defaultSettings.showAllAlternatives)

export const normalizeSettings = (value: unknown): Settings => {
  const candidate = (value ?? {}) as Partial<Settings>
  return {
    platformPreference: validPreference(candidate.platformPreference),
    showAllAlternatives: coerceBoolean(candidate.showAllAlternatives),
    badgeSize: validBadgeSize(candidate.badgeSize)
  }
}

export const detectPlatform = (): Platform => {
  const nav = (typeof navigator === 'undefined' ? null : navigator) as { userAgentData?: { platform?: string }; userAgent?: string } | null
  const source = (nav?.userAgentData?.platform ?? nav?.userAgent ?? '').toLowerCase()
  return source.includes('mac')
    ? 'mac'
    : source.includes('win')
      ? 'windows'
      : 'linux'
}

export const resolvePlatform = (preference: PlatformPreference, detected: Platform): Platform =>
  preference === 'auto' ? detected : preference

export const loadSettings = async (): Promise<Settings> => normalizeSettings(await readLocal<Settings>(settingsKey, defaultSettings))

export const saveSettings = async (settings: Settings): Promise<void> => writeLocal(settingsKey, normalizeSettings(settings))

export const subscribeSettings = (listener: (next: Settings) => void): void => {
  subscribeLocal((changes) => {
    const updated = changes[settingsKey]
    const hasChange = typeof updated !== 'undefined'
    switch (hasChange) {
    case true:
      listener(normalizeSettings(updated.newValue))
      break
    default:
      break
    }
  })
}
