import { describe, it, expect } from 'vitest'
import { annotateDocument } from '../src/content/annotate'

describe('annotateDocument', () => {
  const settings = { platform: 'linux', showAllAlternatives: false } satisfies { platform: 'linux'; showAllAlternatives: boolean }
  const buildDocument = (html: string): Document => new DOMParser().parseFromString(html, 'text/html')
  const macSettings = { platform: 'mac', showAllAlternatives: false } satisfies { platform: 'mac'; showAllAlternatives: boolean }

  it('data-hotkey を持つ要素にバッジを付与する', () => {
    const doc = buildDocument('<a data-hotkey="g c">Issues</a>')

    annotateDocument(doc, settings)

    const badge = doc.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('GC')
    expect(badge?.getAttribute('aria-hidden')).toBe('true')
  })

  it('既に注釈済みの要素に重複バッジを付けない', () => {
    const doc = buildDocument('<button data-hotkey="shift+p">Palette</button>')

    annotateDocument(doc, settings)
    annotateDocument(doc, settings)

    const badges = doc.querySelectorAll('.ghsk-badge')
    expect(badges.length).toBe(1)
  })

  it('3キー以上のショートカットはポップアップに埋め込む（Copy raw file）', () => {
    const doc = buildDocument('<button aria-label="Copy raw file" data-hotkey="Meta+/ Meta+r"></button>')
    const target = doc.querySelector('button')

    annotateDocument(doc, macSettings)

    expect(target?.getAttribute('data-ghsk-popup')).toBe('⌘ / ⌘ R')
    expect(target?.getAttribute('aria-label')).toBe('Copy raw file (⌘ / ⌘ R)')
    expect(doc.querySelector('.ghsk-badge')).toBeNull()
  })

  it('3キー以上のショートカットは data-tooltip にも追記する', () => {
    const doc = buildDocument('<button aria-label="Copy raw file" data-tooltip="Copy raw file" data-hotkey="Meta+Shift+C"></button>')
    const target = doc.querySelector('button')

    annotateDocument(doc, macSettings)

    expect(target?.getAttribute('data-ghsk-popup')).toBe('⌘ ⇧ C')
    expect(target?.getAttribute('aria-label')).toBe('Copy raw file (⌘ ⇧ C)')
    expect(target?.getAttribute('data-tooltip')).toBe('Copy raw file (⌘ ⇧ C)')
  })

  it('2キー以下はポップアップにせず、再注釈してもバッジのみを維持する', () => {
    const doc = buildDocument('<a data-hotkey="g c">Issues</a>')
    const target = doc.querySelector('a')

    annotateDocument(doc, settings)
    annotateDocument(doc, settings)

    expect(target?.getAttribute('data-ghsk-popup')).toBeNull()
    const badge = target?.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('GC')
  })

  it('Edit mode の Preview ボタンに Mod+Shift+P を付与する（3キーなのでポップアップ）', () => {
    const doc = buildDocument(`
      <ul aria-label="Edit mode">
        <li><button aria-current="false"><span>Preview</span></button></li>
      </ul>
    `)
    const target = doc.querySelector('button')

    annotateDocument(doc, macSettings)

    expect(target?.getAttribute('data-ghsk-popup')).toBe('⌘ ⇧ P')
  })

  it('Edit mode の Edit ボタンにも Mod+Shift+P を付与する（3キーなのでポップアップ）', () => {
    const doc = buildDocument(`
      <ul aria-label="Edit mode">
        <li><button aria-current="true"><span>Edit</span></button></li>
      </ul>
    `)
    const target = doc.querySelector('button')

    annotateDocument(doc, macSettings)

    expect(target?.getAttribute('data-ghsk-popup')).toBe('⌘ ⇧ P')
  })

  it('Issues フィルタの Labels ボタンに L を付与する', () => {
    const doc = buildDocument(`
      <div class="filters">
        <button type="button"><span>Labels</span></button>
      </div>
    `)
    const target = doc.querySelector('button')

    annotateDocument(doc, settings)

    const badge = target?.querySelector('.ghsk-badge')
    expect(badge?.textContent).toBe('L')
  })

  it('data-ghsk-enabled="0" のときは注釈しない', () => {
    const doc = buildDocument('<a data-hotkey="g c">Issues</a>')
    doc.documentElement.setAttribute('data-ghsk-enabled', '0')

    annotateDocument(doc, settings)

    expect(doc.querySelector('.ghsk-badge')).toBeNull()
    expect(doc.querySelector('[data-ghsk-popup]')).toBeNull()
  })
})
