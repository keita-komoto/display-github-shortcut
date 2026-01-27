import { readLocal, subscribeLocal, writeLocal } from './storage'

const enabledKey = 'ghskEnabled'

export const loadEnabled = async (): Promise<boolean> => await readLocal<boolean>(enabledKey, true)

export const saveEnabled = async (next: boolean): Promise<void> => writeLocal(enabledKey, next)

export const subscribeEnabled = (listener: (next: boolean) => void): void => {
  subscribeLocal((changes) => {
    const updated = changes[enabledKey]
    const changed = typeof updated !== 'undefined'
    const nextValue = typeof updated === 'undefined' ? true : Boolean(updated.newValue ?? true)
    switch (changed) {
    case true:
      listener(nextValue)
      break
    default:
      break
    }
  })
}
