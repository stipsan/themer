// Removes search params that match defaults specified in the preset

import { applyHues } from 'utils/applyHues'
import { TONES } from 'utils/colors'
import { parseHuesFromSearchParams } from 'utils/parseHuesFromSearchParams'
import { getPreset } from 'utils/presets'
import { stringifyColorSearchParam } from 'utils/stringifyColorSearchParam'
import { applyHuesFromPreset } from 'utils/applyHuesFromPreset'

export function shortenPresetSearchParams(searchParams: URLSearchParams) {
  const preset = getPreset(searchParams.get('preset'))
  const { searchParams: presetParams } = new URL(preset.url, 'http://localhost')
  // Get defaults from preset
  const defaults = applyHues(parseHuesFromSearchParams(presetParams))

  // Merge current search params with the preset params
  const mergedParams = new URLSearchParams(presetParams)
  if (searchParams.has('lightest')) {
    mergedParams.set('lightest', searchParams.get('lightest'))
  }
  if (searchParams.has('darkest')) {
    mergedParams.set('darkest', searchParams.get('darkest'))
  }

  for (const tone of TONES) {
    if (searchParams.has(tone)) {
      mergedParams.set(tone, searchParams.get(tone))
    }
  }

  const hues = applyHues(parseHuesFromSearchParams(searchParams), defaults)

  // Start off by checking for lightest and darkest duplicates
  const lightestMap = new Map<string, number>()
  const darkestMap = new Map<string, number>()

  for (const tone of TONES) {
    if (!lightestMap.has(hues[tone].lightest)) {
      lightestMap.set(hues[tone].lightest, 0)
    } else {
      lightestMap.set(
        hues[tone].lightest,
        lightestMap.get(hues[tone].lightest) + 1
      )
    }
    if (!darkestMap.has(hues[tone].darkest)) {
      darkestMap.set(hues[tone].darkest, 0)
    } else {
      darkestMap.set(hues[tone].darkest, darkestMap.get(hues[tone].darkest) + 1)
    }
  }

  let lightest
  if (lightestMap.size === TONES.length) {
    searchParams.delete('lightest')
  } else {
    let count = 0
    for (const [key, value] of lightestMap) {
      if (value > count) {
        count = value
        lightest = key
      }
    }
    searchParams.set('lightest', stringifyColorSearchParam(lightest))
  }
  let darkest
  if (darkestMap.size === TONES.length) {
    searchParams.delete('darkest')
  } else {
    let count = 0
    for (const [key, value] of darkestMap) {
      if (value > count) {
        count = value
        darkest = key
      }
    }
    searchParams.set('darkest', stringifyColorSearchParam(darkest))
  }

  for (const tone of TONES) {
    const baseHue = defaults[tone]
    const hue = hues[tone]
    const shouldSkipLightest = lightest && hue.lightest === lightest
    const shouldSkipDarkest = darkest && hue.darkest === darkest
    const param = [
      baseHue.mid !== hue.mid && stringifyColorSearchParam(hue.mid),
      baseHue.midPoint !== hue.midPoint && hue.midPoint,
      shouldSkipLightest
        ? false
        : lightest && hue.lightest !== lightest
        ? `lightest:${stringifyColorSearchParam(hue.lightest)}`
        : baseHue.lightest !== hue.lightest &&
          `lightest:${stringifyColorSearchParam(
            hue.lightest || baseHue.lightest
          )}`,
      shouldSkipDarkest
        ? false
        : darkest && hue.darkest !== darkest
        ? `darkest:${stringifyColorSearchParam(hue.darkest)}`
        : baseHue.darkest !== hue.darkest &&
          `darkest:${stringifyColorSearchParam(
            hue.darkest || baseHue.darkest
          )}`,
    ]
      .filter(Boolean)
      .join(';')

    if (param === '') {
      searchParams.delete(tone)
    } else {
      searchParams.set(tone, param)
    }
  }
}
