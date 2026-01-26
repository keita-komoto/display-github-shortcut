import { formatHotkey, type HotkeyFormatOptions, type Platform } from '../shared/hotkeyFormat'

interface AnnotationSettings {
  platform: Platform
  showAllAlternatives: boolean
}

const markerAttribute = 'data-ghsk-annotated'
const hotkeyAttribute = 'data-hotkey'
const ariaShortcutAttribute = 'aria-keyshortcuts'

const resolveKnownHotkey = (element: Element): string => {
  const ariaAttr = element.getAttribute('aria-label')
  const ariaLabel = typeof ariaAttr === 'string' ? ariaAttr : ''
  const label = element.textContent.trim().toLowerCase()
  const ariaLower = ariaLabel.toLowerCase()
  const matchesGithubDev = ariaLower.includes('github.dev editor') || label.includes('github.dev')
  const matchesCodeButton = label === 'code'
  return matchesGithubDev || matchesCodeButton ? '>' : ''
}

const resolveEditModeHotkey = (element: Element): string => {
  const label = element.textContent.trim().toLowerCase()
  const isPreview = label === 'preview'
  const isEdit = label === 'edit'
  const inEditModeControl = element.closest('[aria-label="Edit mode"]') !== null
  const isTarget = isPreview || isEdit
  return isTarget && inEditModeControl ? 'Mod+Shift+P' : ''
}

const resolveNewIssueHotkey = (element: Element): string => {
  const tagName = element.tagName.toLowerCase()
  const isAnchor = tagName === 'a'
  const isButton = tagName === 'button'
  const hrefValue = element.getAttribute('href')
  const href = hrefValue ?? ''
  const matchesPath = href.includes('/issues/new')
  const label = element.textContent.trim().toLowerCase()
  const matchesLabel = label.includes('new issue')
  return (isAnchor && matchesPath) || (isButton && matchesLabel) ? 'c' : ''
}

const resolveFilterHotkey = (element: Element): string => {
  const label = element.textContent.trim().toLowerCase()
  const filters: Record<string, string> = {
    labels: 'l',
    milestones: 'm',
    assignees: 'a',
    author: 'u',
    projects: 'p',
    sort: 's',
    reviews: 'r'
  }
  return filters[label] ?? ''
}

const isAnnotated = (element: Element): boolean => element.getAttribute(markerAttribute) === '1'

const markAnnotated = (element: Element): Element => {
  element.setAttribute(markerAttribute, '1')
  return element
}

const createBadge = (doc: Document, text: string): HTMLSpanElement => {
  const badge = doc.createElement('span')
  badge.className = 'ghsk-badge'
  badge.setAttribute('aria-hidden', 'true')
  text.split('').forEach((ch) => {
    if (ch === ' ') {
      return
    }
    const key = doc.createElement('span')
    key.className = 'ghsk-key'
    key.textContent = ch
    badge.appendChild(key)
  })
  return badge
}

const hotkeyText = (element: Element): string => {
  const direct = element.getAttribute(hotkeyAttribute)
  const aria = element.getAttribute(ariaShortcutAttribute)
  const known = resolveKnownHotkey(element)
  const editMode = resolveEditModeHotkey(element)
  const inferred = resolveNewIssueHotkey(element)
  const filter = resolveFilterHotkey(element)
  const candidates = [direct ?? '', aria ?? '', known, editMode, inferred, filter]
  const first = candidates.find((value) => value.length > 0)
  return first ?? ''
}

const annotateElement = (element: Element, doc: Document, options: HotkeyFormatOptions): void => {
  const raw = hotkeyText(element)
  const formatted = raw.length > 0 ? formatHotkey(raw, options) : ''
  const ariaLabel = element.getAttribute('aria-label') ?? ''
  const isCopyRaw = ariaLabel.toLowerCase().includes('copy raw file')
  const keyCount = formatted.split(/\s+/).filter((token) => token.length > 0).length
  const shouldShowPopup = keyCount >= 3
  const tooltip = element.getAttribute('data-tooltip') ?? ''
  const shouldAppendTooltip = formatted.length > 0 && (isCopyRaw || shouldShowPopup)
  const appendTooltip = (value: string): string => shouldAppendTooltip && value.length > 0 && !value.includes(formatted)
    ? `${value} (${formatted})`
    : value
  const updatedLabel = appendTooltip(ariaLabel)
  const updatedTooltip = appendTooltip(tooltip)
  if (updatedLabel.length > 0) {
    element.setAttribute('aria-label', updatedLabel)
  }
  if (updatedTooltip.length > 0) {
    element.setAttribute('data-tooltip', updatedTooltip)
  }
  const badgeCandidate = !shouldShowPopup && formatted.length > 0 && !isAnnotated(element) ? createBadge(doc, formatted) : null
  const apply = shouldShowPopup
    ? (): null => {
      element.setAttribute('data-ghsk-popup', formatted)
      return null
    }
    : (): Element | null => {
      element.removeAttribute('data-ghsk-popup')
      const appendedBadge = badgeCandidate === null ? null : element.appendChild(badgeCandidate)
      return appendedBadge === null ? null : markAnnotated(element)
    }
  apply()
}

export const annotateDocument = (doc: Document, settings: AnnotationSettings): void => {
  const targets = Array.from(
    doc.querySelectorAll(
      `[${hotkeyAttribute}], [${ariaShortcutAttribute}], a[href*="/issues/new"], button`
    )
  )
  const options: HotkeyFormatOptions = { platform: settings.platform, showAllAlternatives: settings.showAllAlternatives }
  targets.forEach((element) => {
    annotateElement(element, doc, options)
  })
}
