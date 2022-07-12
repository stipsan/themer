import {
  type ColorHueConfig,
  type ColorTints,
  COLOR_TINTS,
} from '@sanity/color'
import {
  type CardTone,
  Box,
  Card,
  Grid,
  Label,
  Text,
  Tooltip,
} from '@sanity/ui'
import { mix } from 'polished'
import {
  type TransitionStartFunction,
  memo,
  useEffect,
  useId,
  useState,
} from 'react'
import styled from 'styled-components'
import { isMidPoint } from 'utils/isMidPoint'
import { isColor } from 'utils/parseHuesFromSearchParams'
import type { Hue, Hues } from 'utils/types'

const RENDER_TONES = [
  'default',
  'primary',
  'transparent',
  'positive',
  'caution',
  'critical',
] as const

interface Props {
  // Needs to be stable or it'll reset
  initialHues: Hues
  onChange: (tone: CardTone, hue: Hue) => void
  startTransition: TransitionStartFunction
  prepareTransition: () => void
}
function HuesFields({
  initialHues,
  onChange,
  startTransition,
  prepareTransition,
}: Props) {
  return (
    <>
      {RENDER_TONES.map((key) => {
        return (
          <HueFields
            key={key}
            initialHue={initialHues[key]}
            tone={key}
            onChange={onChange}
            startTransition={startTransition}
            prepareTransition={prepareTransition}
          />
        )
      })}
    </>
  )
}

export default memo(HuesFields)

const HueFields = memo(function HueFields({
  initialHue,
  tone,
  onChange,
  startTransition,
  prepareTransition,
}: {
  initialHue: Hue
  tone: CardTone
  onChange: (tone: CardTone, hue: Hue) => void
  startTransition: TransitionStartFunction
  prepareTransition: () => void
}) {
  // Fast state for intenral use, for inputs, range drags, the color picker etc
  const [lightest, setLightest] = useState(() => initialHue.lightest)
  const [mid, setMid] = useState(() => initialHue.mid)
  const [darkest, setDarkest] = useState(() => initialHue.darkest)
  const [midPoint, setMidPoint] = useState(() => `${initialHue.midPoint}`)

  // Correct state, uses a transition
  const [hue, setHue] = useState(() => initialHue)

  // Sync when another preset is loaded
  useEffect(() => {
    setHue(initialHue)
    setLightest(initialHue.lightest)
    setMid(initialHue.mid)
    setDarkest(initialHue.darkest)
    setMidPoint(`${initialHue.midPoint}`)
  }, [initialHue])

  // Sync with onChange, parent comp have to implement startTransition on their end
  useEffect(() => {
    onChange(tone, hue)
  }, [tone, hue, onChange])

  /**
   * Default
  
  Tones preview
  50 100 200 ---- 800 900 950
   */

  const midRangeId = `${tone}-mid-range-${useId()}`
  const colorStyle = {
    boxSizing: 'border-box',
    background: 'var(--card-border-color)',
    border: '1px solid var(--card-border-color)',
    borderRadius: '2px',
    padding: '0px 2px',
    appearance: 'none',
    margin: 0,
  }

  return (
    <>
      <Card
        paddingTop={4}
        paddingX={4}
        paddingBottom={4}
        tone={tone}
        shadow={1}
      >
        <Text
          size={2}
          weight="medium"
          muted
          style={{ textTransform: 'capitalize' }}
        >
          {tone}
        </Text>
        <Grid columns={[1, 3]} paddingTop={4}>
          <Card tone={tone} key="mid">
            <Label muted size={0}>
              Mid
            </Label>
            <Card paddingY={2} tone={tone}>
              <input
                name={`${tone}-mid`}
                type="color"
                style={colorStyle as any}
                value={
                  mid.length === 4 ? `${mid}${mid.replace(/^#/, '')}` : mid
                }
                onChange={(event) => {
                  const { value } = event.target

                  setMid(value)
                  prepareTransition()
                  startTransition(() => {
                    if (isColor(value)) {
                      setHue((hue) => ({ ...hue, mid: value }))
                    }
                  })
                }}
              />
              <Text
                as="output"
                muted
                size={0}
                style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
              >
                {hue.mid}
              </Text>
            </Card>
          </Card>
          <Card tone={tone} key="lightest">
            <Label muted size={0}>
              Lightest
            </Label>
            <Card paddingY={2} tone={tone}>
              <input
                type="color"
                style={colorStyle as any}
                value={
                  lightest.length === 4
                    ? `${lightest}${lightest.replace(/^#/, '')}`
                    : lightest
                }
                onChange={(event) => {
                  const { value } = event.target

                  setLightest(value)
                  prepareTransition()
                  startTransition(() => {
                    if (isColor(value)) {
                      setHue((hue) => ({ ...hue, lightest: value }))
                    }
                  })
                }}
              />
              <Text
                as="output"
                muted
                size={0}
                style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
              >
                {hue.lightest}
              </Text>
            </Card>
          </Card>
          <Card tone={tone} key="darkest">
            <Label muted size={0}>
              Darkest
            </Label>
            <Card paddingY={2} tone={tone}>
              <input
                name={`${tone}-darkest`}
                type="color"
                style={colorStyle as any}
                value={
                  darkest.length === 4
                    ? `${darkest}${darkest.replace(/^#/, '')}`
                    : darkest
                }
                onChange={(event) => {
                  const { value } = event.target

                  setDarkest(value)
                  prepareTransition()
                  startTransition(() => {
                    if (isColor(value)) {
                      setHue((hue) => ({ ...hue, darkest: value }))
                    }
                  })
                }}
              />
              <Text
                as="output"
                muted
                size={0}
                style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
              >
                {hue.darkest}
              </Text>
            </Card>
          </Card>
        </Grid>
        <Card tone={tone} paddingTop={3} paddingBottom={2}>
          <Label muted size={0}>
            Mid point ({roundToScale(Number(midPoint))})
          </Label>
          <Card paddingY={2} tone={tone}>
            <StyledRange
              name={`${tone}-midPoint`}
              // @TODO handle keyboard nav, make it inc between tints directly instead of every integer between 50 and 950
              type="range"
              min={50}
              max={950}
              value={midPoint}
              list={midRangeId}
              onChange={(event) => {
                const { value } = event.target

                setMidPoint(value)
                prepareTransition()
                startTransition(() => {
                  const nextMidPoint = roundToScale(Number(value))
                  if (!Number.isNaN(nextMidPoint) && isMidPoint(nextMidPoint)) {
                    setHue((hue) => ({ ...hue, midPoint: value as any }))
                  }
                })
              }}
              onPointerUp={(event) => {
                prepareTransition()
                setMidPoint(
                  roundToScale(event.currentTarget.value as any) as any
                )
              }}
              onBlur={(event) => {
                prepareTransition()
                setMidPoint(
                  roundToScale(event.currentTarget.value as any) as any
                )
              }}
            />
            <datalist id={midRangeId}>
              {COLOR_TINTS.map((tint) => (
                <option key={tint} value={tint} />
              ))}
            </datalist>
          </Card>
        </Card>
        <Card tone={tone} shadow={1} radius={1}>
          <Grid columns={11} style={{ gap: '1px' }}>
            <ColorTintsPreview hue={{mid, midPoint, lightest, darkest}} title={tone} />
          </Grid>
        </Card>
      </Card>
    </>
  )
})

// https://github.com/sanity-io/design/blob/804bf73dffb1c0ecb1c2e6758135784502768bfe/packages/%40sanity/color/scripts/generate.ts#L18-L58
function getColorHex(config: ColorHueConfig, tint: string): string {
  const tintNum = Number(tint)
  const midPoint = config.midPoint || 500
  const darkSize = 1000 - midPoint
  const lightPosition = tintNum / midPoint
  const darkPosition = (tintNum - midPoint) / darkSize

  if (tintNum === midPoint) {
    return config.mid.toLowerCase()
  }

  // light side of scale: x < midPoint
  if (tintNum < midPoint) {
    return mix(lightPosition, config.mid, config.lightest)
  }

  // dark side of scale: x > midPoint
  return mix(darkPosition, config.darkest, config.mid)
}

// https://github.com/sanity-io/design/blob/804bf73dffb1c0ecb1c2e6758135784502768bfe/packages/%40sanity/color/scripts/generate.ts#L42-L58
export function createTintsFromHue(config: ColorHueConfig): ColorTints {
  const initial = {} as ColorTints
  const tints = COLOR_TINTS.reduce((acc, tint) => {
    acc[tint] = {
      title: `${config.title} ${tint}`,
      hex: getColorHex(config, tint),
    }

    return acc
  }, initial)

  return tints
}

function ColorTintsPreview({ hue, title }: { hue: Hue; title: string }) {
  const tints = createTintsFromHue({ ...hue, title })
  return (
    <>
      {Object.entries(tints).map(([tint, color]) => (
        <Tooltip
          key={tint}
          content={
            <Card tone="default" key={tint} radius={2}>
              <Card
                padding={4}
                radius={3}
                style={{
                  background: color.hex,
                  borderBottomLeftRadius: '0px',
                  borderBottomRightRadius: '0px',
                }}
              />
              <Box padding={1} paddingTop={2}>
                <Text size={0} muted>
                  {tint}
                </Text>
              </Box>
              <Box padding={1} paddingBottom={2}>
                <Text size={0} style={{ minWidth: '56px' }}>
                  {color.hex}
                </Text>
              </Box>
            </Card>
          }
          fallbackPlacements={['right', 'left']}
          placement="top"
          portal
        >
          <Card
            tone="default"
            radius={1}
            style={{
              background: color.hex,
            }}
            paddingY={2}
          />
        </Tooltip>
      ))}
    </>
  )
}

const StyledRange = styled.input`
  accent-color: var(--card-focus-ring-color, currentColor);
  width: 100%;

  &::-webkit-slider-runnable-track {
    border-color: var(--card-focus-ring-color, currentColor);
  }
  &[type='range']::-webkit-slider-thumb {
    border-color: var(--card-focus-ring-color, currentColor);
    background-color: var(--card-focus-ring-color, currentColor);
  }
`

/*
// @TODO revisit later
// Using .attrs to fool the type checker as @sanity/ui isn't prepared to style it
// No worries, we're styling it here
const ColorInput = styled(TextInput).attrs({ type: 'color' as 'text' })`
flex: none;
padding: 0;
background: red

&&[type="color"] {
  ${({theme}) => {
    console.log('theme from func', theme)
    return `
    --size-diff-positive: ${theme.sanity.color.solid.positive.enabled.bg};
    --size-diff-negative: ${theme.sanity.color.solid.critical.enabled.bg};
    --input-fg-color: ${theme.sanity.color.input.default.enabled.fg};
    --input-placeholder-color: ${theme.sanity.color.input.default.enabled.placeholder};
  `
  }}
	-webkit-appearance: none;
	border: none;
	width: 32px;
	height: 32px;
  padding: 1px;
}
& [type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}
& [type="color"]::-webkit-color-swatch {
	border: none; 
}
`

// */

function roundToScale(value: number): number {
  if (value < 75) {
    return 50
  }
  if (value > 925) {
    return 950
  }

  return Math.round(value / 100) * 100
}
