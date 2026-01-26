import { annotateDocument } from './content/annotate'
import { type Platform } from './shared/hotkeyFormat'

interface NavigatorLike {
  userAgentData?: { platform?: string }
  userAgent?: string
}

interface ChromeStorageArea {
  get: (items: Record<string, unknown>, callback: (items: Record<string, unknown>) => void) => void
  set: (items: Record<string, unknown>, callback: () => void) => void
}

interface ChromeStorageEvents {
  addListener: (callback: (changes: Record<string, { oldValue?: unknown; newValue?: unknown }>, areaName: string) => void) => void
}

interface ChromeStorageNamespace {
  local?: ChromeStorageArea
  onChanged?: ChromeStorageEvents
}

const storageKey = 'ghskEnabled'

const detectPlatform = (): Platform => {
  const nav: NavigatorLike | null = typeof navigator === 'undefined' ? null : navigator
  const uaPlatform = nav?.userAgentData?.platform ?? ''
  const fallback = nav?.userAgent ?? ''
  const source = (uaPlatform.length > 0 ? uaPlatform : fallback).toLowerCase()
  return source.includes('mac') ? 'mac' : source.includes('win') ? 'windows' : 'linux'
}

const chromeStorage = (): { storage?: ChromeStorageNamespace } | null => {
  const maybeGlobal = globalThis as { chrome?: { storage?: ChromeStorageNamespace } }
  const maybeChrome = maybeGlobal.chrome
  if (typeof maybeChrome === 'undefined') {
    return null
  }
  return maybeChrome
}

const readEnabled = async (): Promise<boolean> => {
  const storage = chromeStorage()
  const local = storage?.storage?.local
  if (local !== undefined) {
    return await new Promise((resolve) => {
      local.get({ [storageKey]: true }, (items) => {
        const value = items[storageKey]
        resolve(Boolean(value ?? true))
      })
    })
  }
  if (typeof localStorage === 'undefined') {
    return true
  }
  const stored = localStorage.getItem(storageKey)
  return stored === null ? true : stored !== '0' && stored !== 'false'
}

const writeEnabled = async (value: boolean): Promise<void> => {
  const storage = chromeStorage()
  const local = storage?.storage?.local
  if (local !== undefined) {
    await new Promise<void>((resolve) => {
      local.set({ [storageKey]: value }, () => {
        resolve()
      })
    })
    return
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(storageKey, value ? '1' : '0')
  }
}

const runAnnotation = (platform: Platform): void => {
  const settings = { platform, showAllAlternatives: false }
  annotateDocument(document, settings)
}

const observeMutations = (platform: Platform): void => {
  const observer = new MutationObserver((records) => {
    const addedElements = records.flatMap((record) => Array.from(record.addedNodes))
      .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    const isDisabled = document.documentElement.getAttribute('data-ghsk-enabled') === '0'
    if (addedElements.length > 0 && !isDisabled) {
      runAnnotation(platform)
    }
  })
  observer.observe(document.documentElement, { childList: true, subtree: true })
}

const isToggleHotkey = (event: KeyboardEvent, platform: Platform): boolean => {
  const key = event.key.toLowerCase()
  const isMac = platform === 'mac'
  const modifierMatch = isMac
    ? event.metaKey && event.ctrlKey && !event.altKey
    : event.ctrlKey && event.altKey && !event.metaKey
  return modifierMatch && key === 'b'
}

const applyEnabled = (enabled: boolean, platform: Platform): void => {
  document.documentElement.setAttribute('data-ghsk-enabled', enabled ? '1' : '0')
  if (enabled) {
    runAnnotation(platform)
  }
}

const registerStorageSync = (platform: Platform): void => {
  const storage = chromeStorage()
  const onChanged = storage?.storage?.onChanged
  if (onChanged === undefined) {
    return
  }
  onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') {
      return
    }
    const next = changes[storageKey]
    if (typeof next === 'undefined') {
      return
    }
    const enabled = Boolean(next.newValue ?? true)
    applyEnabled(enabled, platform)
  })
}

const main = async (): Promise<void> => {
  console.debug('[ghsk] contentScript loaded')
  const platform = detectPlatform()
  const initialEnabled = await readEnabled()
  applyEnabled(initialEnabled, platform)
  observeMutations(platform)
  registerStorageSync(platform)
  window.addEventListener('keydown', (event) => {
    const shouldToggle = isToggleHotkey(event, platform)
    if (!shouldToggle) {
      return
    }
    event.preventDefault()
    const nextEnabled = document.documentElement.getAttribute('data-ghsk-enabled') === '0'
    applyEnabled(nextEnabled, platform)
    void writeEnabled(nextEnabled)
  })
}

void main()
