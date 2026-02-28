import { formatHotkey, type HotkeyFormatOptions } from '../shared/hotkeyFormat'
import type { ResolvedSettings } from '../shared/settings'

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
  const candidates = [
    element.textContent,
    element.getAttribute('aria-label'),
    element.getAttribute('title')
  ]
  const label = candidates
    .map((value) => (value ?? '').trim().toLowerCase())
    .find((value) => value.length > 0) ?? ''
  const filters: Record<string, string> = {
    labels: 'l',
    milestones: 'm',
    assignees: 'a',
    author: 'u',
    projects: 'p',
    reviews: 'r'
  }
  const matched = Object.entries(filters).find(
    ([key]) => label === key || label.includes(key)
  )
  return matched ? matched[1] : ''
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
  text
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .forEach((token) => {
      const key = doc.createElement('span')
      key.className = 'ghsk-key'
      key.textContent = token
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

const updateTooltipAttributes = (
  element: Element,
  nextAriaLabel: string,
  nextTooltip: string,
  hasAriaLabel: boolean,
  hasTooltip: boolean
): void => {
  const updates = [
    { name: 'aria-label', value: nextAriaLabel, shouldApply: hasAriaLabel },
    { name: 'data-tooltip', value: nextTooltip, shouldApply: hasTooltip }
  ]
  updates.forEach(({ name, value, shouldApply }) => {
    const apply = shouldApply
      ? (): void => {
        element.setAttribute(name, value)
      }
      : (): void => undefined
    apply()
  })
}

const annotateElement = (element: Element, doc: Document, options: HotkeyFormatOptions): void => {
  const raw = hotkeyText(element)
  const formatted = raw.length > 0 ? formatHotkey(raw, options) : ''
  const ariaLabelAttr = element.getAttribute('aria-label')
  const tooltipAttr = element.getAttribute('data-tooltip')
  const hasAriaLabel = ariaLabelAttr !== null
  const hasTooltip = tooltipAttr !== null
  const ariaLabel = ariaLabelAttr ?? ''
  const tooltip = tooltipAttr ?? ''
  const keyCount = formatted.split(/\s+/).filter((token) => token.length > 0).length
  const shouldShowPopup = keyCount >= 3
  const isCopyRaw = ariaLabel.toLowerCase().includes('copy raw file')
  const shouldAppendTooltip = formatted.length > 0 && (isCopyRaw || shouldShowPopup)
  const appendTooltip = (value: string): string =>
    shouldAppendTooltip && value.length > 0 && !value.includes(formatted) ? `${value} (${formatted})` : value
  const nextLabel = appendTooltip(ariaLabel)
  const nextTooltip = appendTooltip(tooltip)
  const badgeCandidate = !shouldShowPopup && formatted.length > 0 && !isAnnotated(element) ? createBadge(doc, formatted) : null
  const apply = formatted.length === 0
    ? (): void => undefined
    : shouldShowPopup
      ? (): null => {
        updateTooltipAttributes(element, nextLabel, nextTooltip, hasAriaLabel, hasTooltip)
        element.setAttribute('data-ghsk-popup', formatted)
        return null
      }
      : (): Element | null => {
        updateTooltipAttributes(element, nextLabel, nextTooltip, hasAriaLabel, hasTooltip)
        element.removeAttribute('data-ghsk-popup')
        const appendedBadge = badgeCandidate === null ? null : element.appendChild(badgeCandidate)
        return appendedBadge === null ? null : markAnnotated(element)
      }
  apply()
}

const clearDocumentAnnotations = (doc: Document): void => {
  doc.querySelectorAll('.ghsk-badge').forEach((badge) => {
    badge.remove()
  })
  doc.querySelectorAll(`[${markerAttribute}]`).forEach((element) => {
    element.removeAttribute(markerAttribute)
  })
  doc.querySelectorAll('[data-ghsk-popup]').forEach((element) => {
    element.removeAttribute('data-ghsk-popup')
  })
}

const targetSelectors = [
  `[${hotkeyAttribute}]`,
  `[${ariaShortcutAttribute}]`,
  'a[href*="/issues/new"]',
  '[aria-label="Edit mode"] button',
  '.filters button',
  '.filters summary',
  '.table-list-filters a',
  '.table-list-filters button',
  '.table-list-filters summary',
  '.table-list-filters details summary',
  '.issues-list-options a',
  '.issues-list-options button',
  '.issues-list-options summary',
  '[data-action-bar-item] button',
  'button[aria-label="Code"]',
  '[aria-label="Code"]',
  '.subnav-search-context summary',
  '.subnav-links button',
  '.subnav-links summary',
  'summary[aria-label="Code"]'
].join(', ')

const uniqueElements = (elements: Element[]): Element[] => {
  const seen = new Set<Element>()
  return elements.filter((el) => (seen.has(el) ? false : (seen.add(el), true)))
}

const annotateTargets = (doc: Document, settings: ResolvedSettings, roots: Element[]): void => {
  doc.documentElement.setAttribute('data-ghsk-badge-size', settings.badgeSize)
  const enabled = doc.documentElement.getAttribute('data-ghsk-enabled') !== '0'
  const options: HotkeyFormatOptions = { platform: settings.platform, showAllAlternatives: settings.showAllAlternatives }
  const scoped = roots.flatMap((root) => {
    const self = root.matches(targetSelectors) ? [root] : []
    const descendants = Array.from(root.querySelectorAll(targetSelectors))
    return [...self, ...descendants]
  })
  const codeButtons = Array.from(doc.querySelectorAll('button')).filter(
    (element) => element.textContent.trim().toLowerCase() === 'code'
  )
  scoped.push(...codeButtons)
  const targets = uniqueElements(scoped)
  const clear = (): void => {
    clearDocumentAnnotations(doc)
  }
  const apply = enabled
    ? (): void => {
      targets.forEach((element) => {
        annotateElement(element, doc, options)
      })
    }
    : clear
  apply()
}

export const annotateDocument = (doc: Document, settings: ResolvedSettings): void => {
  annotateTargets(doc, settings, [doc.documentElement])
}

export const annotateWithin = (doc: Document, settings: ResolvedSettings, roots: Element[]): void => {
  annotateTargets(doc, settings, roots)
}
