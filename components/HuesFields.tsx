import { COLOR_TINTS } from '@sanity/color'
import { type CardTone, Card, Grid, Skeleton, Text } from '@sanity/ui'
import { ColorInput, Label } from 'components/Sidebar.styles'
import {
  type TransitionStartFunction,
  lazy,
  memo,
  Suspense,
  useEffect,
  useId,
  useState,
} from 'react'
import styled from 'styled-components'
import { isMidPoint } from 'utils/isMidPoint'
import { isColor } from 'utils/parseHuesFromSearchParams'
import type { Hue, Hues } from 'utils/types'

// @TODO move into shared utils
const RENDER_TONES = [
  'default',
  'primary',
  'transparent',
  'positive',
  'caution',
  'critical',
] as const

const ColorTintsPreview = lazy(() => import('components/ColorTintsPreview'))

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

  const midRangeId = `${tone}-mid-range-${useId()}`

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
          size={1}
          weight="medium"
          style={{
            textTransform: 'capitalize',
            paddingLeft: 'env(safe-area-inset-left)',
          }}
        >
          {tone}
        </Text>
        <Grid
          columns={3}
          paddingTop={4}
          style={{ paddingLeft: 'env(safe-area-inset-left)' }}
        >
          <Card tone={tone} key="mid">
            <Label>Mid</Label>
            <Card paddingY={2} tone={tone}>
              <ColorInput
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
            <Label>Lightest</Label>
            <Card paddingY={2} tone={tone}>
              <ColorInput
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
            <Label>Darkest</Label>
            <Card paddingY={2} tone={tone}>
              <ColorInput
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
        <Card
          tone={tone}
          paddingTop={3}
          paddingBottom={2}
          style={{ paddingLeft: 'env(safe-area-inset-left)' }}
        >
          <Label>Mid point ({roundToScale(Number(midPoint))})</Label>
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
        <Card
          tone={tone}
          shadow={1}
          radius={1}
          overflow="hidden"
          style={{ marginLeft: 'env(safe-area-inset-left)' }}
        >
          <Suspense fallback={<Skeleton paddingY={2} animated radius={1} />}>
            <Grid columns={11} style={{ gap: '0px' }}>
              <ColorTintsPreview
                hue={{ mid, midPoint: midPoint as any, lightest, darkest }}
                title={tone}
              />
            </Grid>
          </Suspense>
        </Card>
      </Card>
    </>
  )
})

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

function roundToScale(value: number): number {
  if (value < 75) {
    return 50
  }
  if (value > 925) {
    return 950
  }

  return Math.round(value / 100) * 100
}
