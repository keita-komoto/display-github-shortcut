import { defaultSettings, loadSettings, normalizeSettings, saveSettings, type Settings } from '../shared/settings'

interface Elements {
  platform: HTMLSelectElement | null
  showAll: HTMLInputElement | null
  badgeSize: HTMLSelectElement | null
}

const elements: Elements = {
  platform: document.getElementById('platform') as HTMLSelectElement | null,
  showAll: document.getElementById('show-all') as HTMLInputElement | null,
  badgeSize: document.getElementById('badge-size') as HTMLSelectElement | null
}

const setPlatform = (value: Settings['platformPreference']): void => {
  const target = elements.platform
  switch (target) {
  case null:
    break
  default:
    target.value = value
    break
  }
}

const setShowAll = (value: boolean): void => {
  const target = elements.showAll
  switch (target) {
  case null:
    break
  default:
    target.checked = value
    break
  }
}

const setBadgeSize = (value: Settings['badgeSize']): void => {
  const target = elements.badgeSize
  switch (target) {
  case null:
    break
  default:
    target.value = value
    break
  }
}

const applySettings = (settings: Settings): void => {
  setPlatform(settings.platformPreference)
  setShowAll(settings.showAllAlternatives)
  setBadgeSize(settings.badgeSize)
}

const readForm = (): Settings =>
  normalizeSettings({
    platformPreference: elements.platform?.value ?? defaultSettings.platformPreference,
    showAllAlternatives: elements.showAll?.checked ?? defaultSettings.showAllAlternatives,
    badgeSize: (elements.badgeSize?.value as Settings['badgeSize'] | undefined) ?? defaultSettings.badgeSize
  })

const handleChange = (): void => {
  const current = readForm()
  void saveSettings(current)
}

const bind = (): void => {
  const attach = (element: HTMLElement | null): void => {
    element?.addEventListener('change', handleChange)
  }
  attach(elements.platform)
  attach(elements.showAll)
  attach(elements.badgeSize)
}

const init = async (): Promise<void> => {
  const settings = await loadSettings()
  applySettings(settings)
  bind()
}

void init()
