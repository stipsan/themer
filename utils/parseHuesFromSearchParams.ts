import type { PartialDeep } from 'type-fest'
import { isMidPoint } from 'utils/isMidPoint'
import type { Hue, Hues } from 'utils/types'
import { ValidationError } from 'utils/ValidationError'

export function parseHuesFromSearchParams(
  searchParams: URLSearchParams
): PartialDeep<Hues> {
  const lightest = searchParams.has('lightest')
    ? assertValidColor(`#${searchParams.get('lightest')}`)
    : undefined
  const darkest = searchParams.get('darkest')
    ? assertValidColor(`#${searchParams.get('darkest')}`)
    : undefined

  return {
    default: parseHue('default', searchParams, lightest, darkest),
    primary: parseHue('primary', searchParams, lightest, darkest),
    transparent: parseHue('transparent', searchParams, lightest, darkest),
    positive: parseHue('positive', searchParams, lightest, darkest),
    caution: parseHue('caution', searchParams, lightest, darkest),
    critical: parseHue('critical', searchParams, lightest, darkest),
  }
}

type ParsedHue = Partial<Hue>
function parseHue(
  key: string,
  searchParams: URLSearchParams,
  defaultLightest: string | null,
  defaultDarkest: string | null
): ParsedHue {
  if (!searchParams.has(key)) {
    return { lightest: defaultLightest, darkest: defaultDarkest }
  }
  const input = searchParams.get(key)

  let mid: string | undefined
  let midPoint: Hue['midPoint'] | undefined
  let lightest: string | undefined
  let darkest: string | undefined
  // format: color;midPoint;lightest:color;darkest:color
  const params = input.split(';')
  if (params.length > 4) {
    throw new ValidationError(
      `Invalid number of params for the ${key} hue, it should be 4 or less instead it's ${
        params.length
      }: ${JSON.stringify(params)}`
    )
  }
  for (const param of params) {
    const maybeMid = `#${param}`
    const maybeMidPoint = Number(param)

    switch (true) {
      case param === '':
        break
      case isColor(maybeMid) && !mid:
        mid = maybeMid
        break
      case !Number.isNaN(maybeMidPoint) && !midPoint:
        midPoint = assertValidMidPoint(maybeMidPoint)
        break
      case param.startsWith('lightest:') && !lightest:
        lightest = assertValidColor(`#${param.replace(/^lightest:/, '')}`)
        break
      case param.startsWith('darkest:') && !darkest:
        darkest = assertValidColor(`#${param.replace(/^darkest:/, '')}`)
        break
      // Filter out duplicates
      case isColor(maybeMid):
        throwDuplicate(key, mid.replace(/^#/, ''), param, input)
      case !Number.isNaN(maybeMidPoint):
        throwDuplicate(key, midPoint, maybeMidPoint, input)
      case param.startsWith('lightest:'):
        throwDuplicate(key, lightest.replace(/^#/, 'lightest:'), param, input)
      case param.startsWith('darkest:'):
        throwDuplicate(key, darkest.replace(/^#/, 'darkest:'), param, input)
      default:
        // If the parser can't make sense of it we throw to surface that something is wrong with the input
        throw new ValidationError(`Invalid param for the ${key} hue: ${param}`)
    }
  }

  return {
    mid,
    // If the mid color is specified, but the midPoint is not, set the midPoint to 500 by default to ensure colors like 'positive' and 'caution' that have other midPoints don't get unexpected results
    midPoint: midPoint ?? mid ? 500 : undefined,
    lightest: lightest ?? defaultLightest,
    darkest: darkest ?? defaultDarkest,
  }
}

function throwDuplicate(key: string, a: unknown, b: unknown, input: string) {
  throw new ValidationError(
    `Duplicate params detected. Remove at least ${
      a === b
        ? `one of the ${JSON.stringify(`${a}`)}`
        : `${JSON.stringify(`${a}`)} or ${JSON.stringify(`${b}`)}`
    } from the ${key} hue: ${JSON.stringify(input)}`
  )
}

function assertValidColor(input: string) {
  if (isColor(input)) {
    return input
  }
  throw new ValidationError(`Invalid color: ${input}`)
}
export const isColor = (input: string) =>
  Boolean(input.match(/^#(?:[0-9a-f]{3}){1,2}$/i))

function assertValidMidPoint(input: number): Hue['midPoint'] {
  if (isMidPoint(input)) {
    return input
  }
  throw new ValidationError(`Invalid midPoint: ${input}`)
}
