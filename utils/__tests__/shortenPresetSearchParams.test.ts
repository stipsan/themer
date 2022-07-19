import { applyHuesFromPreset } from 'utils/applyHuesFromPreset'
import { defaultPreset } from 'utils/presets'
import { shortenPresetSearchParams } from 'utils/shortenPresetSearchParams'

test('hoists duplicate lightest values', () => {
  let url = new URL(defaultPreset.url, 'http://localhost')
  let searchParams = new URLSearchParams(url.search)
  // @TODO use this technique to test other presets
  // url.searchParams.set('preset', defaultPreset.slug)

  // Snap before altering
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"lightest=fff&darkest=101112&default=8690a0;500&primary=2276fc;500&transparent=8690a0;500&positive=43d675;400&caution=fbd024;300&critical=f03e2f;500"`
  )

  searchParams.delete('lightest')
  searchParams.set('default', `${searchParams.get('default')};lightest:f00`)
  searchParams.set('primary', `${searchParams.get('primary')};lightest:f00`)
  searchParams.set(
    'transparent',
    `${searchParams.get('transparent')};lightest:f00`
  )
  searchParams.set('positive', `${searchParams.get('positive')};lightest:f00`)
  // Give caution a different lightest, and don't modify critical
  searchParams.set('caution', `${searchParams.get('caution')};lightest:ff0`)
  // Snap after modifying
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"darkest=101112&default=8690a0;500;lightest:f00&primary=2276fc;500;lightest:f00&transparent=8690a0;500;lightest:f00&positive=43d675;400;lightest:f00&caution=fbd024;300;lightest:ff0&critical=f03e2f;500"`
  )

  let shorterParams = new URLSearchParams(searchParams)
  shortenPresetSearchParams(shorterParams)
  expect(decodeURIComponent(shorterParams.toString())).toMatchInlineSnapshot(
    `"darkest=101112&caution=lightest:ff0&critical=lightest:fff&lightest=f00"`
  )
  // With global lightest, it should remove duplicates from the other tones
  expect(shorterParams.get('default')).not.toBe('lightest:f00')
  expect(shorterParams.get('primary')).not.toBe('lightest:f00')
  expect(shorterParams.get('transparent')).not.toBe('lightest:f00')
  expect(shorterParams.get('positive')).not.toBe('lightest:f00')
  expect(shorterParams.get('caution')).not.toBe('lightest:f00')
  expect(shorterParams.get('critical')).not.toBe('lightest:f00')

  // Verify the same hues are produced with both URLs
  let presetParams = new URLSearchParams(url.search)
  let expected = applyHuesFromPreset(presetParams, searchParams)
  let result = applyHuesFromPreset(presetParams, shorterParams)
  expect(result.default.lightest).toBe('#f00')
  expect(result.primary.lightest).toBe('#f00')
  expect(result.transparent.lightest).toBe('#f00')
  expect(result.positive.lightest).toBe('#f00')
  // Caution is given a different lightest than the others, it should stay intact
  expect(result.caution.lightest).toBe('#ff0')
  // The global lightest param isn't added initially, thus the lightest color for critical should still be #fff
  expect(result.critical.lightest).toBe('#fff')
  expect(expected).toEqual(result)
})

test('hoists duplicate darkest values', () => {
  let url = new URL(defaultPreset.url, 'http://localhost')
  let searchParams = new URLSearchParams(url.search)
  // @TODO use this technique to test other presets
  // url.searchParams.set('preset', defaultPreset.slug)

  // Snap before altering
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"lightest=fff&darkest=101112&default=8690a0;500&primary=2276fc;500&transparent=8690a0;500&positive=43d675;400&caution=fbd024;300&critical=f03e2f;500"`
  )

  searchParams.delete('darkest')
  searchParams.set('default', `${searchParams.get('default')};darkest:f00`)
  searchParams.set('primary', `${searchParams.get('primary')};darkest:f00`)
  searchParams.set(
    'transparent',
    `${searchParams.get('transparent')};darkest:f00`
  )
  searchParams.set('positive', `${searchParams.get('positive')};darkest:f00`)
  // Give caution a different darkest, and don't modify critical
  searchParams.set('caution', `${searchParams.get('caution')};darkest:ff0`)
  // Snap after modifying
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"lightest=fff&default=8690a0;500;darkest:f00&primary=2276fc;500;darkest:f00&transparent=8690a0;500;darkest:f00&positive=43d675;400;darkest:f00&caution=fbd024;300;darkest:ff0&critical=f03e2f;500"`
  )

  const shorterParams = new URLSearchParams(searchParams)
  shortenPresetSearchParams(shorterParams)
  expect(decodeURIComponent(shorterParams.toString())).toMatchInlineSnapshot(
    `"lightest=fff&caution=darkest:ff0&critical=darkest:101112&darkest=f00"`
  )
  // With global darkest, it should remove duplicates from the other tones
  expect(shorterParams.get('default')).not.toBe('darkest:f00')
  expect(shorterParams.get('primary')).not.toBe('darkest:f00')
  expect(shorterParams.get('transparent')).not.toBe('darkest:f00')
  expect(shorterParams.get('positive')).not.toBe('darkest:f00')
  expect(shorterParams.get('caution')).not.toBe('darkest:f00')
  expect(shorterParams.get('critical')).not.toBe('darkest:f00')

  // Verify the same hues are produced with both URLs
  const presetParams = new URLSearchParams(url.search)
  const expected = applyHuesFromPreset(presetParams, searchParams)
  const result = applyHuesFromPreset(presetParams, shorterParams)
  expect(result.default.darkest).toBe('#f00')
  expect(result.primary.darkest).toBe('#f00')
  expect(result.transparent.darkest).toBe('#f00')
  expect(result.positive.darkest).toBe('#f00')
  // Caution is given a different darkest than the others, it should stay intact
  expect(result.caution.darkest).toBe('#ff0')
  // The global darkest param isn't added initially, thus the darkest color for critical should still be #fff
  expect(result.critical.darkest).toBe('#101112')
  expect(expected).toEqual(result)
})

test('&lightest overrides preset values', () => {
  //
})

test('&darkest overrides preset values', () => {
  //
})

test('midPoint 500 is optional', () => {
  //
})

test('midPoint 500 is optional', () => {
  // most of the time but not always
})

test('hues that are equal to the preset are optional', () => {
  // sometimes the whole param can be omitted, other times parts of it
})
