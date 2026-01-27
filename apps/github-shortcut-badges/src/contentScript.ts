import { annotateDocument, annotateWithin } from './content/annotate'
import { loadEnabled, saveEnabled, subscribeEnabled } from './shared/enabled'
import { detectPlatform, loadSettings, resolvePlatform, subscribeSettings, type ResolvedSettings, type Settings } from './shared/settings'
import type { Platform } from './shared/hotkeyFormat'

interface RuntimeState {
  settings: ResolvedSettings
  enabled: boolean
  observer: MutationObserver | null
  enqueue: (roots: Element[]) => void
  pending: Set<Element>
}

const observerOptions: MutationObserverInit = { childList: true, subtree: true }

const createDebounced = <T extends unknown[]>(fn: (...args: T) => void, delay = 40): ((...args: T) => void) => {
  let handle: ReturnType<typeof setTimeout> | undefined
  return (...args: T): void => {
    switch (typeof handle === 'undefined') {
    case false: {
      clearTimeout(handle)
      handle = undefined
      break
    }
    default:
      break
    }
    handle = setTimeout(() => {
      handle = undefined
      fn(...args)
    }, delay)
  }
}

const resolved = (settings: Settings, detected: Platform): ResolvedSettings => ({
  ...settings,
  platform: resolvePlatform(settings.platformPreference, detected)
})

const applyEnabled = (state: RuntimeState, enabled: boolean): void => {
  state.enabled = enabled
  document.documentElement.setAttribute('data-ghsk-enabled', enabled ? '1' : '0')
  annotateDocument(document, state.settings)
}

const isToggleHotkey = (event: KeyboardEvent, platform: Platform): boolean => {
  const key = event.key.toLowerCase()
  const isMac = platform === 'mac'
  const modifierMatch = isMac
    ? event.metaKey && event.ctrlKey && !event.altKey
    : event.ctrlKey && event.altKey && !event.metaKey
  return modifierMatch && key === 'b'
}

const handleToggle = (state: RuntimeState, event: KeyboardEvent): void => {
  event.preventDefault()
  const nextEnabled = !state.enabled
  applyEnabled(state, nextEnabled)
  void saveEnabled(nextEnabled)
}

const observeMutations = (state: RuntimeState): void => {
  const observer = new MutationObserver((records) => {
    const elements = records
      .flatMap((record) => Array.from(record.addedNodes))
      .filter((node): node is Element => node.nodeType === Node.ELEMENT_NODE)
    const relevant = elements.filter(
      (element) =>
        element.closest('[data-ghsk-annotated="1"]') === null && element.closest('.ghsk-badge') === null
    )
    relevant.forEach((element) => state.pending.add(element))
    const roots = Array.from(state.pending)
    state.pending.clear()
    switch (state.enabled && roots.length > 0) {
    case true:
      state.enqueue(roots)
      break
    default:
      break
    }
  })
  observer.observe(document.documentElement, observerOptions)
  state.observer = observer
}

const registerStorageSync = (state: RuntimeState, detected: Platform): void => {
  subscribeEnabled((next) => {
    applyEnabled(state, next)
  })
  subscribeSettings((next) => {
    state.settings = resolved(next, detected)
    annotateDocument(document, state.settings)
  })
}

const setupHotkey = (state: RuntimeState): void => {
  window.addEventListener('keydown', (event) => {
    switch (isToggleHotkey(event, state.settings.platform)) {
    case true:
      handleToggle(state, event)
      break
    default:
      break
    }
  })
}

const bindNavigation = (state: RuntimeState): void => {
  const rerun = (): void => {
    if (state.enabled) {
      annotateDocument(document, state.settings)
    }
  }
  ;['pjax:end', 'turbo:render', 'turbo:load', 'turbo:frame-load', 'visibilitychange'].forEach((eventName) => {
    document.addEventListener(eventName, rerun)
  })
}

const bootstrap = async (): Promise<void> => {
  const detected = detectPlatform()
  const baseSettings = await loadSettings()
  const initialSettings = resolved(baseSettings, detected)
  const enabled = await loadEnabled()
  const state: RuntimeState = { settings: initialSettings, enabled, observer: null, enqueue: (): void => undefined, pending: new Set<Element>() }
  state.enqueue = createDebounced((roots: Element[]) => {
    state.observer?.disconnect()
    annotateWithin(document, state.settings, roots)
    state.pending.clear()
    state.observer?.observe(document.documentElement, observerOptions)
  })
  applyEnabled(state, enabled)
  observeMutations(state)
  registerStorageSync(state, detected)
  setupHotkey(state)
  bindNavigation(state)
}

void bootstrap()
