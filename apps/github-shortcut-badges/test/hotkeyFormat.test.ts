import { describe, it, expect } from 'vitest'
import { formatHotkey, type HotkeyFormatOptions } from '../src/shared/hotkeyFormat'

describe('formatHotkey', () => {
  const options = (platform: HotkeyFormatOptions['platform'], showAllAlternatives = false): HotkeyFormatOptions => ({
    platform,
    showAllAlternatives
  })

  it('Mod をプラットフォームごとに展開する（macはCmd）', () => {
    expect(formatHotkey('Mod+K', options('mac'))).toBe('⌘ K')
  })

  it('Mod をプラットフォームごとに展開する（windowsはCtrl）', () => {
    expect(formatHotkey('Mod+K', options('windows'))).toBe('Ctrl K')
  })

  it('シーケンスを then で示す', () => {
    expect(formatHotkey('g c', options('linux'))).toBe('G C')
  })

  it('修飾キーと文字を整形する', () => {
    expect(formatHotkey('shift+ctrl+p', options('windows'))).toBe('Shift Ctrl P')
  })

  it('代替ホットキーを showAllAlternatives で切り替える', () => {
    const raw = 'ctrl+k, ctrl+g'
    expect(formatHotkey(raw, options('windows', false))).toBe('Ctrl K')
    expect(formatHotkey(raw, options('windows', true))).toBe('Ctrl K / Ctrl G')
  })

})
