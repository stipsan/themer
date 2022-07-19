/**
 * Yes a lot of the code here is gnarly, nasty and overly defensive.
 * That's because this file is currently in Stage 1 "Make it work".
 * The next two stages will be "Make right" and "Make it fast".
 * Stage 2 requires integrtation tests.
 */

import type { PartialDeep } from 'type-fest'
import { darkest, lightest } from 'utils/colors'
import type { Hues } from 'utils/types'

const defaultHues: Hues = {
  default: {
    lightest,
    darkest,
    mid: '#8690a0',
    midPoint: 500,
  },
  primary: {
    lightest,
    darkest,
    mid: '#2276fc',
    midPoint: 500,
  },
  transparent: {
    lightest,
    darkest,
    mid: '#8690a0',
    midPoint: 500,
  },
  positive: {
    lightest,
    darkest,
    mid: '#43d675',
    midPoint: 400,
  },
  caution: {
    lightest,
    darkest,
    mid: '#fbd024',
    midPoint: 300,
  },
  critical: {
    lightest,
    darkest,
    mid: '#f03e2f',
    midPoint: 500,
  },
}

export function applyHues(
  hues: PartialDeep<Hues>,
  defaults: Hues = defaultHues
): Hues {
  const defaultMid = hues.default?.mid?.toLowerCase() || defaults.default.mid
  const primaryMid = hues.primary?.mid?.toLowerCase() || defaults.primary.mid
  const transparentMid =
    hues.transparent?.mid?.toLowerCase() || defaults.transparent.mid
  const positiveMid = hues.positive?.mid?.toLowerCase() || defaults.positive.mid
  const cautionMid = hues.caution?.mid?.toLowerCase() || defaults.caution.mid
  const criticalMid = hues.critical?.mid?.toLowerCase() || defaults.critical.mid
  return {
    default: {
      ...defaults.default,
      midPoint:
        defaultMid === defaults.default.mid
          ? defaults.default.midPoint
          : hues.default?.midPoint || 500,
      ...hues.default,
      mid: defaultMid,
    },
    primary: {
      ...defaults.primary,
      ...hues.primary,
      midPoint:
        primaryMid === defaults.primary.mid
          ? defaults.primary.midPoint
          : hues.primary?.midPoint || 500,
      mid: primaryMid,
    },
    transparent: {
      ...defaults.transparent,
      ...hues.transparent,
      midPoint:
        transparentMid === defaults.transparent.mid
          ? defaults.transparent.midPoint
          : hues.transparent?.midPoint || 500,
      mid: transparentMid,
    },
    positive: {
      ...defaults.positive,
      ...hues.positive,
      midPoint:
        positiveMid === defaults.positive.mid
          ? defaults.positive.midPoint
          : hues.positive?.midPoint || 500,
      mid: positiveMid,
    },
    caution: {
      ...defaults.caution,
      ...hues.caution,
      midPoint:
        cautionMid === defaults.caution.mid
          ? defaults.caution.midPoint
          : hues.caution?.midPoint || 500,
      mid: cautionMid,
    },
    critical: {
      ...defaults.critical,
      ...hues.critical,
      midPoint:
        criticalMid === defaults.critical.mid
          ? defaults.critical.midPoint
          : hues.critical?.midPoint || 500,
      mid: criticalMid,
    },
  }
}
