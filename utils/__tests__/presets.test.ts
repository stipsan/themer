import { applyHues } from 'utils/applyHues'
import { parseHuesFromSearchParams } from 'utils/parseHuesFromSearchParams'
import { defaultPreset } from 'utils/presets'

test('Default preset URL is in sync with hue defaults', () => {
  const { searchParams } = new URL(defaultPreset.url, 'http://localhost')
  const hues = parseHuesFromSearchParams(searchParams)
  expect(hues).toEqual(applyHues({}))
})
