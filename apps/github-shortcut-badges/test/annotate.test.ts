import { describe, it, expect } from 'vitest'
import { annotateDocument } from '../src/content/annotate'
import { defaultSettings, type ResolvedSettings } from '../src/shared/settings'

describe('annotateDocument', () => {
  const settings = (platform: ResolvedSettings['platform']): ResolvedSettings => ({
    ...defaultSettings,
    platformPreference: platform,
    platform,
    showAllAlternatives: false
  })
  const buildDocument = (html: string): Document => new DOMParser().parseFromString(html, 'text/html')

  it('data-hotkey を持つ要素にバッジを付与する', () => {
    const doc = buildDocument('<a data-hotkey="g c">Issues</a>')

    annotateDocument(doc, settings('linux'))

    const badge = doc.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('GC')
    expect(badge?.getAttribute('aria-hidden')).toBe('true')
  })

  it('既に注釈済みの要素に重複バッジを付けない', () => {
    const doc = buildDocument('<button data-hotkey="shift+p">Palette</button>')

    annotateDocument(doc, settings('linux'))
    annotateDocument(doc, settings('linux'))

    const badges = doc.querySelectorAll('.ghsk-badge')
    expect(badges.length).toBe(1)
  })

  it('3キー以上のショートカットはポップアップに埋め込む（Copy raw file）', () => {
    const doc = buildDocument('<button aria-label="Copy raw file" data-hotkey="Meta+/ Meta+r"></button>')
    const target = doc.querySelector('button')

    annotateDocument(doc, settings('mac'))

    expect(target?.getAttribute('data-ghsk-popup')).toBe('⌘ / ⌘ R')
    expect(target?.getAttribute('aria-label')).toBe('Copy raw file (⌘ / ⌘ R)')
    expect(doc.querySelector('.ghsk-badge')).toBeNull()
  })

  it('3キー以上のショートカットは data-tooltip にも追記する', () => {
    const doc = buildDocument('<button aria-label="Copy raw file" data-tooltip="Copy raw file" data-hotkey="Meta+Shift+C"></button>')
    const target = doc.querySelector('button')

    annotateDocument(doc, settings('mac'))

    expect(target?.getAttribute('data-ghsk-popup')).toBe('⌘ ⇧ C')
    expect(target?.getAttribute('aria-label')).toBe('Copy raw file (⌘ ⇧ C)')
    expect(target?.getAttribute('data-tooltip')).toBe('Copy raw file (⌘ ⇧ C)')
  })

  it('2キー以下はポップアップにせず、再注釈してもバッジのみを維持する', () => {
    const doc = buildDocument('<a data-hotkey="g c">Issues</a>')
    const target = doc.querySelector('a')

    annotateDocument(doc, settings('linux'))
    annotateDocument(doc, settings('linux'))

    expect(target?.getAttribute('data-ghsk-popup')).toBeNull()
    const badge = target?.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('GC')
  })

  it('既存 aria-label/data-tooltip が無い要素には空文字属性を追加しない', () => {
    const doc = buildDocument('<a data-hotkey="g c">Issues</a>')
    const target = doc.querySelector('a')

    annotateDocument(doc, settings('linux'))

    expect(target?.hasAttribute('aria-label')).toBe(false)
    expect(target?.hasAttribute('data-tooltip')).toBe(false)
  })

  it('Edit mode の Preview ボタンに Mod+Shift+P を付与する（3キーなのでポップアップ）', () => {
    const doc = buildDocument(`
      <ul aria-label="Edit mode">
        <li><button aria-current="false"><span>Preview</span></button></li>
      </ul>
    `)
    const target = doc.querySelector('button')

    annotateDocument(doc, settings('mac'))

    expect(target?.getAttribute('data-ghsk-popup')).toBe('⌘ ⇧ P')
  })

  it('Edit mode の Edit ボタンにも Mod+Shift+P を付与する（3キーなのでポップアップ）', () => {
    const doc = buildDocument(`
      <ul aria-label="Edit mode">
        <li><button aria-current="true"><span>Edit</span></button></li>
      </ul>
    `)
    const target = doc.querySelector('button')

    annotateDocument(doc, settings('mac'))

    expect(target?.getAttribute('data-ghsk-popup')).toBe('⌘ ⇧ P')
  })

  it('Issues フィルタの Labels ボタンに L を付与する', () => {
    const doc = buildDocument(`
      <div class="filters">
        <button type="button"><span>Labels</span></button>
      </div>
    `)
    const target = doc.querySelector('button')

    annotateDocument(doc, settings('linux'))

    const badge = target?.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('L')
  })

  it('Issues フィルタの Labels サマリに L を付与する', () => {
    const doc = buildDocument(`
      <div class="filters">
        <details>
          <summary><span>Labels</span></summary>
        </details>
      </div>
    `)
    const target = doc.querySelector('summary')

    annotateDocument(doc, settings('linux'))

    const badge = target?.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('L')
  })

  it('Sort フィルタ summary の aria-label から S を推定する', () => {
    const doc = buildDocument(`
      <div class="table-list-filters">
        <details>
          <summary aria-label="Sort options"></summary>
        </details>
      </div>
    `)
    const target = doc.querySelector('summary')

    annotateDocument(doc, settings('linux'))

    const badge = target?.querySelector('.ghsk-badge')
    expect(badge).toBeNull()
  })

  it('Issues リストオプション内の Milestones summary に M を付与する', () => {
    const doc = buildDocument(`
      <div class="issues-list-options">
        <details>
          <summary aria-label="Milestones"></summary>
        </details>
      </div>
    `)
    const target = doc.querySelector('summary')

    annotateDocument(doc, settings('linux'))

    const badge = target?.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('M')
  })

  it('Issues フィルタの Labels リンクに L を付与する', () => {
    const doc = buildDocument(`
      <div class="table-list-filters">
        <a aria-label="Labels" href="#labels">Labels</a>
      </div>
    `)
    const target = doc.querySelector('a')

    annotateDocument(doc, settings('linux'))

    const badge = target?.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('L')
  })

  it('Issues アクションバーの Labels ボタンに L を付与する', () => {
    const doc = buildDocument(`
      <div class="VisibleAndOverflowContainer-module__Box_0--KyT2b">
        <div data-action-bar-item="labels">
          <button type="button" aria-label="Filter by label">
            <span>Labels</span>
          </button>
        </div>
      </div>
    `)
    const target = doc.querySelector('button')

    annotateDocument(doc, settings('linux'))

    const badge = target?.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('L')
  })

  it('Code ドロップダウン summary に > を付与する', () => {
    const doc = buildDocument('<summary aria-label="Code">Code</summary>')
    const target = doc.querySelector('summary')

    annotateDocument(doc, settings('mac'))

    const badge = target?.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('>')
  })

  it('Code ボタン (aria-label="Code") に > を付与する', () => {
    const doc = buildDocument('<button aria-label="Code" type="button">Code</button>')
    const target = doc.querySelector('button')

    annotateDocument(doc, settings('mac'))

    const badge = target?.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('>')
  })

  it('data-ghsk-enabled="0" のときは注釈しない', () => {
    const doc = buildDocument('<a data-hotkey="g c">Issues</a>')
    doc.documentElement.setAttribute('data-ghsk-enabled', '0')

    annotateDocument(doc, settings('linux'))

    expect(doc.querySelector('.ghsk-badge')).toBeNull()
    expect(doc.querySelector('[data-ghsk-popup]')).toBeNull()
  })

  it('キーはトークン単位で描画する（Ctrl/Enter の2キー）', () => {
    const doc = buildDocument('<button data-hotkey="ctrl+enter">Run</button>')

    annotateDocument(doc, settings('windows'))

    const keys = Array.from(doc.querySelectorAll('.ghsk-key')).map((el) => el.textContent)
    expect(keys).toEqual(['Ctrl', 'Enter'])
  })

  it('data-hotkey も aria-keyshortcuts も無いボタンは注釈対象にしない', () => {
    const doc = buildDocument('<button type="button">No shortcut</button>')

    annotateDocument(doc, settings('linux'))

    expect(doc.querySelector('.ghsk-badge')).toBeNull()
  })

  it('ホットキーが推定できない要素は aria-label や data-tooltip を空にしない', () => {
    const doc = buildDocument('<button type="button">No shortcut</button>')
    const target = doc.querySelector('button')

    annotateDocument(doc, settings('linux'))

    expect(target?.hasAttribute('aria-label')).toBe(false)
    expect(target?.hasAttribute('data-tooltip')).toBe(false)
  })

  it('無効化後に既存バッジを除去する', () => {
    const doc = buildDocument('<a data-hotkey="g c">Issues</a>')
    const target = doc.querySelector('a')

    annotateDocument(doc, settings('linux'))
    expect(target?.querySelector('.ghsk-badge')).not.toBeNull()

    doc.documentElement.setAttribute('data-ghsk-enabled', '0')
    annotateDocument(doc, settings('linux'))

    expect(target?.querySelector('.ghsk-badge')).toBeNull()
    expect(target?.getAttribute('data-ghsk-popup')).toBeNull()
    expect(target?.getAttribute('data-ghsk-annotated')).toBeNull()
  })

  it('無効化時に注釈対象から外れた要素の既存バッジも除去する', () => {
    const doc = buildDocument('<a data-hotkey="g c">Issues</a>')
    const target = doc.querySelector('a')

    annotateDocument(doc, settings('linux'))
    expect(target?.querySelector('.ghsk-badge')).not.toBeNull()

    target?.removeAttribute('data-hotkey')
    doc.documentElement.setAttribute('data-ghsk-enabled', '0')
    annotateDocument(doc, settings('linux'))

    expect(target?.querySelector('.ghsk-badge')).toBeNull()
    expect(target?.getAttribute('data-ghsk-annotated')).toBeNull()
    expect(target?.getAttribute('data-ghsk-popup')).toBeNull()
  })
})
