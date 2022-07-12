// Handy list over all the preset themes

import type { ThemePreset } from 'utils/types'

export const defaultTheme: ThemePreset = {
  slug: 'default',
  title: 'Default Studio Theme',
  url: '/api/hues',
}

export const pinkSynthWave: ThemePreset = {
  slug: 'pink-synth-wave',
  title: 'Pink Synth Wave',
  url: '/api/hues?lightest=f7f2f5&darkest=171721&default=8b6584&primary=ec4899&transparent=503a4c&positive=10b981&caution=fde047;300&critical=fe3459',
}

export const presets: ThemePreset[] = [defaultTheme, pinkSynthWave]

// @TODO sort through these:
/*
import {studioTheme} from 'https://themer.creativecody.dev/api/image?url=https://cdn.sanity.io/images/zp7mbokg/production/G3i4emG6B8JnTmGoN0UjgAp8-300x450.jpg'
import {studioTheme} from 'https://themer.creativecody.dev/api/image/zp7mbokg/production/G3i4emG6B8JnTmGoN0UjgAp8-300x450.jpg'
// Default theme minimal URL (all these are optional and can be omitted)
import {studioTheme} from 'https://themer.creativecody.dev/api/hues?default=8690a0&primary=2276fc&transparent=8690a0&positive=43d675;400&caution=fbd024;300&critical=f03e2f;700'
// Changing the darkest and lightest colors for all colors
import {studioTheme} from 'https://themer.creativecody.dev/api/hues?lightest=e6e6e6&darkest=000000'
// Changing the darkest color for critical, and lightest for caution
import {studioTheme} from 'https://themer.creativecody.dev/api/hues?caution=lightest:f8df79&critical=darkest:351716'
// Changing just the midPoint for primary (darker blue)
import {studioTheme} from 'https://themer.creativecody.dev/api/hues?primary=400'
// */
