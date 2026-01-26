import { annotateDocument } from './content/annotate'
import { type Platform } from './shared/hotkeyFormat'

interface NavigatorLike {
  userAgentData?: { platform?: string }
  userAgent?: string
}

const detectPlatform = (): Platform => {
  const nav: NavigatorLike | null = typeof navigator === 'undefined' ? null : navigator
  const uaPlatform = nav?.userAgentData?.platform ?? ''
  const fallback = nav?.userAgent ?? ''
  const source = (uaPlatform.length > 0 ? uaPlatform : fallback).toLowerCase()
  return source.includes('mac') ? 'mac' : source.includes('win') ? 'windows' : 'linux'
}

const runAnnotation = (): void => {
  const settings = { platform: detectPlatform(), showAllAlternatives: false }
  annotateDocument(document, settings)
}

const observeMutations = (): void => {
  const observer = new MutationObserver((records) => {
    const addedElements = records.flatMap((record) => Array.from(record.addedNodes))
      .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    const action = addedElements.length > 0 ? runAnnotation : (): void => undefined
    action()
  })
  observer.observe(document.documentElement, { childList: true, subtree: true })
}

const main = (): void => {
  console.debug('[ghsk] contentScript loaded')
  runAnnotation()
  observeMutations()
}

main()
