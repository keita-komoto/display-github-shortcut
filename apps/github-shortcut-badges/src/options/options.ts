interface StorageApi {
  get: (items: Record<string, unknown>, callback: (items: Record<string, unknown>) => void) => void
  set: (items: Record<string, unknown>, callback?: () => void) => void
}

interface ChromeStorage {
  local: StorageApi
}

interface ChromeHost {
  storage?: ChromeStorage
}

type PlatformPreference = 'auto' | 'mac' | 'windows' | 'linux'

const isStorageApi = (value: unknown): value is StorageApi => (
  typeof value === 'object'
    && value !== null
    && 'get' in value
    && 'set' in value
)

const fallback: PlatformPreference = 'auto'

const resolveStorage = (host: unknown): StorageApi | null => {
  const chromeHost = typeof host === 'object' && host !== null ? host : null
  const storageCandidate = chromeHost && 'storage' in chromeHost ? (chromeHost as ChromeHost).storage ?? null : null
  const localCandidate = storageCandidate && 'local' in storageCandidate ? storageCandidate.local : null
  return isStorageApi(localCandidate) ? localCandidate : null
}

const storage = resolveStorage((globalThis as { chrome?: unknown }).chrome)
const selectElement = document.getElementById('platform') as HTMLSelectElement | null

const applyValue = (element: HTMLSelectElement | null, value: unknown): void => {
  const resolved = typeof value === 'string' ? value : fallback
  const setter = element === null
    ? (): void => { return undefined }
    : (): void => { element.value = resolved }
  setter()
}

const loadPreference = (element: HTMLSelectElement | null): void => {
  const task = storage === null
    ? (): void => { applyValue(element, fallback) }
    : (): void => { storage.get({ platformPreference: fallback }, (items) => { applyValue(element, items.platformPreference) }) }
  task()
}

const persistPreference = (element: HTMLSelectElement | null): void => {
  const task = storage === null || element === null
    ? (): void => { return undefined }
    : (): void => { storage.set({ platformPreference: element.value }) }
  task()
}

const setupSelect = (element: HTMLSelectElement | null): void => {
  const hydrate = (): void => { loadPreference(element) }
  const attach = element === null
    ? (): void => { return undefined }
    : (): void => { element.addEventListener('change', () => { persistPreference(element) }) }
  hydrate()
  attach()
}

setupSelect(selectElement)
