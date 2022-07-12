// Handy list over all the preset themes

import type { ThemePreset } from 'utils/types'

export const defaultPreset: ThemePreset = {
  slug: 'default',
  title: 'Studio v3',
  url: '/api/hues',
}

export const pinkSynth: ThemePreset = {
  slug: 'pink-synth',
  title: 'Pink Synth',
  url: '/api/hues?lightest=f7f2f5&darkest=171721&default=8b6584&primary=ec4899&transparent=503a4c&positive=10b981&caution=fde047;300&critical=fe3459',
}

export const twCyan: ThemePreset = {
  slug: 'tw-cyan',
  title: 'Tailwind Cyan',
  url: '/api/hues?default=677389;500;lightest:f9fafb;darkest:101728&primary=51b4d0;500;lightest:effefe;darkest:264d61&transparent=6b727f;500;lightest:f8fafb;darkest:131826&positive=55b785;500;lightest:eefdf5;darkest:214d3b&caution=e2b53e;500;lightest:fefbea;darkest:69411b&critical=e14f62;500;lightest:fdf2f2;darkest:7d2037&min=1',
}

export const presets: ThemePreset[] = [defaultPreset, pinkSynth, twCyan]

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
// http://localhost:3000/?lightest=f7f2f5&darkest=171721&default=8b6584&primary=ec4899&transparent=503a4c&positive=10b981&caution=fde047;300&critical=fe3459&preset
// 
// */
