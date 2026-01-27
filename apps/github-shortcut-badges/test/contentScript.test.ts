import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const annotateDocument = vi.fn<(doc: Document, settings: unknown) => void>()
const annotateWithin = vi.fn<(doc: Document, settings: unknown, roots: Element[]) => void>()

vi.mock('../src/content/annotate', () => ({
  annotateDocument,
  annotateWithin
}))

type StorageListener = (changes: Record<string, { oldValue?: unknown; newValue?: unknown }>, areaName: string) => void

describe('contentScript', () => {
  const listeners: StorageListener[] = []
  const data: Record<string, unknown> = {
    ghskEnabled: true,
    ghskSettings: { platformPreference: 'auto', showAllAlternatives: false, badgeSize: 'md' }
  }

  const chromeStub = {
    storage: {
      local: {
        get: (items: Record<string, unknown>, cb: (items: Record<string, unknown>) => void): void => {
          const merged = Object.fromEntries(
            Object.entries(items).map(([key, fallback]) => [key, key in data ? data[key] : fallback])
          )
          cb(merged)
        },
        set: (items: Record<string, unknown>, cb: () => void): void => {
          Object.assign(data, items)
          cb()
        }
      },
      onChanged: {
        addListener: (fn: StorageListener): void => {
          listeners.push(fn)
        }
      }
    }
  }

  const emitChange = (changes: Record<string, { oldValue?: unknown; newValue?: unknown }>): void => {
    listeners.forEach((fn) => {
      fn(changes, 'local')
    })
  }

  beforeEach(async () => {
    vi.useFakeTimers()
    vi.resetModules()
    listeners.splice(0, listeners.length)
    annotateDocument.mockClear()
    annotateWithin.mockClear()
    ;(globalThis as { chrome?: unknown }).chrome = chromeStub
    await import('../src/contentScript')
  })

  afterEach(() => {
    vi.runAllTimers()
    vi.useRealTimers()
    ;(globalThis as { chrome?: unknown }).chrome = undefined
  })

  it('初期化時に注釈を実行する', () => {
    expect(annotateDocument).toHaveBeenCalled()
    const enabled = document.documentElement.getAttribute('data-ghsk-enabled')
    expect(enabled).toBe('1')
  })

  it('MutationObserver で追加ノードをデバウンス付きで注釈する', async () => {
    const firstCount = annotateWithin.mock.calls.length
    const fragment = document.createDocumentFragment()
    fragment.appendChild(document.createElement('div'))
    fragment.appendChild(document.createElement('span'))
    document.body.appendChild(fragment)
    await vi.runAllTimersAsync()
    const after = annotateWithin.mock.calls.length
    const diff = after - firstCount
    expect(diff > 0 && diff <= 2).toBe(true)
    const args = annotateWithin.mock.calls.at(-1)?.[2]
    expect(args?.length).toBe(2)
  })

  it('pjax:end で再注釈する', () => {
    annotateDocument.mockClear()

    document.dispatchEvent(new Event('pjax:end'))

    expect(annotateDocument).toHaveBeenCalled()
  })

  it('storage.onChanged で設定変更を反映する', () => {
    annotateDocument.mockClear()
    emitChange({ ghskSettings: { newValue: { platformPreference: 'mac', showAllAlternatives: true, badgeSize: 'lg' } } })
    expect(annotateDocument).toHaveBeenCalled()
  })

  it('ghskEnabled が false になると無効化される', () => {
    emitChange({ ghskEnabled: { newValue: false } })
    const enabled = document.documentElement.getAttribute('data-ghsk-enabled')
    expect(enabled).toBe('0')
  })
})
