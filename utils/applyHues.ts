import type { PartialDeep } from 'type-fest'
import { darkest, lightest } from 'utils/colors'
import type { Hues } from 'utils/types'

export function applyHues(hues: PartialDeep<Hues>): Hues {
  const defaultMid = hues.default?.mid?.toLowerCase() || '#8690a0'
  const primaryMid = hues.primary?.mid?.toLowerCase() || '#2276fc'
  const transparentMid = hues.transparent?.mid?.toLowerCase() || '#8690a0'
  const positiveMid = hues.positive?.mid?.toLowerCase() || '#43d675'
  const cautionMid = hues.caution?.mid?.toLowerCase() || '#fbd024'
  const criticalMid = hues.critical?.mid?.toLowerCase() || '#f03e2f'
  return {
    default: {
      lightest,
      darkest,
      midPoint: 500,
      ...hues.default,
      mid: defaultMid,
    },
    primary: {
      lightest,
      darkest,
      midPoint: 500,
      ...hues.primary,
      mid: primaryMid,
    },
    transparent: {
      lightest,
      darkest,
      midPoint: 500,
      ...hues.transparent,
      mid: transparentMid,
    },
    positive: {
      lightest,
      darkest,
      midPoint: positiveMid === '#43d675' ? 400 : 500,
      ...hues.positive,
      mid: positiveMid,
    },
    caution: {
      lightest,
      darkest,
      midPoint: cautionMid === '#fbd024' ? 300 : 500,
      ...hues.caution,
      mid: cautionMid,
    },
    critical: {
      lightest,
      darkest,
      midPoint: 500,
      ...hues.critical,
      mid: criticalMid,
    },
  }
}
