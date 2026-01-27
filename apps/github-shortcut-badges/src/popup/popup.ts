import { loadEnabled, saveEnabled, subscribeEnabled } from '../shared/enabled'

const setChecked = (input: HTMLInputElement | null, value: boolean): void => {
  switch (input) {
  case null:
    break
  default:
    input.checked = value
    break
  }
}

const bindToggle = (input: HTMLInputElement | null): void => {
  input?.addEventListener('change', () => {
    void saveEnabled(input.checked)
  })
}

const syncToggle = (input: HTMLInputElement | null): void => {
  subscribeEnabled((next) => {
    setChecked(input, next)
  })
}

const init = async (): Promise<void> => {
  const checkbox = document.getElementById('toggle') as HTMLInputElement | null
  const enabled = await loadEnabled()
  setChecked(checkbox, enabled)
  bindToggle(checkbox)
  syncToggle(checkbox)
}

void init()
