const storageKey = 'ghskEnabled'

interface ChromeStorageArea {
  get: (items: Record<string, unknown>, callback: (items: Record<string, unknown>) => void) => void
  set: (items: Record<string, unknown>, callback: () => void) => void
}

interface ChromeStorageNamespace {
  local?: ChromeStorageArea
}

interface ChromeLike {
  storage?: ChromeStorageNamespace
}

const chromeLike = (): ChromeLike => {
  const maybe = (globalThis as { chrome?: ChromeLike }).chrome
  return maybe ?? {}
}

const readEnabled = async (): Promise<boolean> => {
  const chrome = chromeLike()
  const local = chrome.storage?.local
  if (local !== undefined) {
    return await new Promise((resolve) => {
      local.get({ [storageKey]: true }, (items) => {
        resolve(Boolean(items[storageKey] ?? true))
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
  const chrome = chromeLike()
  const local = chrome.storage?.local
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

const init = async (): Promise<void> => {
  const checkbox = document.getElementById('toggle') as HTMLInputElement | null
  if (checkbox === null) {
    return
  }
  const enabled = await readEnabled()
  checkbox.checked = enabled
  checkbox.addEventListener('change', () => {
    void writeEnabled(checkbox.checked)
  })
}

void init()
