export interface ChromeStorageArea {
  get: (items: Record<string, unknown>, callback: (items: Record<string, unknown>) => void) => void
  set: (items: Record<string, unknown>, callback: () => void) => void
}

export interface ChromeStorageEvents {
  addListener: (listener: (changes: Record<string, { oldValue?: unknown; newValue?: unknown }>, areaName: string) => void) => void
}

export interface ChromeStorageNamespace {
  local?: ChromeStorageArea
  onChanged?: ChromeStorageEvents
}

const chromeLike = (): { storage?: ChromeStorageNamespace } => {
  const host = (globalThis as { chrome?: { storage?: ChromeStorageNamespace } }).chrome
  return host ?? {}
}

const localArea = (): ChromeStorageArea | null => {
  const storage = chromeLike().storage
  const local = storage?.local
  return typeof local === 'undefined' ? null : local
}

const safeParse = <T>(raw: string | null, fallback: T): T => {
  try {
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export const readLocal = async <T>(key: string, fallback: T): Promise<T> => {
  const area = localArea()
  const fromChrome = (): Promise<T> =>
    new Promise((resolve) => {
      area?.get({ [key]: fallback }, (items) => {
        const value = items[key] as T | undefined
        resolve(value ?? fallback)
      })
    })
  const fromStorage = (): T => safeParse<T>(typeof localStorage === 'undefined' ? null : localStorage.getItem(key), fallback)
  return area === null ? fromStorage() : await fromChrome()
}

export const writeLocal = async (key: string, value: unknown): Promise<void> => {
  const area = localArea()
  const writeChrome = (): Promise<void> =>
    new Promise((resolve) => {
      area?.set({ [key]: value }, () => {
        resolve()
      })
    })
  const writeStorage = (): void => {
    switch (typeof localStorage === 'undefined') {
    case false:
      localStorage.setItem(key, JSON.stringify(value))
      break
    default:
      break
    }
  }
  const writer = area === null
    ? (): Promise<void> => {
      writeStorage()
      return Promise.resolve()
    }
    : writeChrome
  return writer()
}

export const subscribeLocal = (listener: (changes: Record<string, { oldValue?: unknown; newValue?: unknown }>) => void): void => {
  const onChanged = chromeLike().storage?.onChanged
  onChanged?.addListener((changes, areaName) => {
    switch (areaName === 'local') {
    case true:
      listener(changes)
      break
    default:
      break
    }
  })
}
