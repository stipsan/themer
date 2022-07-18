import { COLOR_TINTS } from '@sanity/color'
import { type CardTone, Card, Grid, Skeleton, Stack, Text } from '@sanity/ui'
import { ColorInput, Label, RangeInput } from 'components/Sidebar.styles'
import {
  type ChangeEventHandler,
  type TransitionStartFunction,
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import { isMidPoint } from 'utils/isMidPoint'
import { isColor } from 'utils/parseHuesFromSearchParams'
import { roundMidPoint } from 'utils/roundMidPoint'
import type { Hue, Hues } from 'utils/types'

import HueColorInput from './HueColorInput'

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
  const [lightest, setLightest] = useState<string>(() => initialHue.lightest)
  const [mid, setMid] = useState<string>(() => initialHue.mid)
  const [darkest, setDarkest] = useState<string>(() => initialHue.darkest)
  const [midPoint, setMidPoint] = useState<string>(
    () => `${initialHue.midPoint}`
  )
  const midPointRounded = useMemo<Hue['midPoint']>(
    () => roundMidPoint(Number(midPoint)),
    [midPoint]
  )

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

  const midChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const { value } = event.target

      setMid(value)
      prepareTransition()
      startTransition(() => {
        if (isColor(value)) {
          setHue((hue) => ({ ...hue, mid: value }))
        }
      })
    },
    [prepareTransition, startTransition]
  )
  const lightestChangeHandler = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const { value } = event.target

      setLightest(value)
      prepareTransition()
      startTransition(() => {
        if (isColor(value)) {
          setHue((hue) => ({ ...hue, lightest: value }))
        }
      })
    },
    [prepareTransition, startTransition]
  )
  const darkestChangeHandler = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const { value } = event.target

      setDarkest(value)
      prepareTransition()
      startTransition(() => {
        if (isColor(value)) {
          setHue((hue) => ({ ...hue, darkest: value }))
        }
      })
    },
    [prepareTransition, startTransition]
  )

  const midRangeId = `${tone}-mid-range-${useId()}`

  return (
    <Card padding={4} tone={tone} shadow={1}>
      <Stack space={4}>
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
        <Grid columns={3} style={{ paddingLeft: 'env(safe-area-inset-left)' }}>
          <HueColorInput
            key="mid"
            label="Mid"
            onChange={midChangeHandler}
            value={mid.length === 4 ? `${mid}${mid.replace(/^#/, '')}` : mid}
          />
          <HueColorInput
            key="lightest"
            label="Lightest"
            onChange={lightestChangeHandler}
            value={
              lightest.length === 4
                ? `${lightest}${lightest.replace(/^#/, '')}`
                : lightest
            }
          />
          <HueColorInput
            key="darkest"
            label="Darkest"
            onChange={darkestChangeHandler}
            value={
              darkest.length === 4
                ? `${darkest}${darkest.replace(/^#/, '')}`
                : darkest
            }
          />
        </Grid>
        <Card tone={tone} style={{ paddingLeft: 'env(safe-area-inset-left)' }}>
          <Label>Mid point ({midPointRounded})</Label>
          <Card paddingY={2} tone={tone}>
            <RangeInput
              name={`${tone}-midPoint`}
              // @TODO handle keyboard nav, make it inc between tints directly instead of every integer between 50 and 950
              min={50}
              max={950}
              value={midPoint}
              list={midRangeId}
              onChange={(event) => {
                const { value } = event.target

                setMidPoint(value)
                prepareTransition()
                startTransition(() => {
                  const nextMidPoint = roundMidPoint(Number(value))
                  if (!Number.isNaN(nextMidPoint) && isMidPoint(nextMidPoint)) {
                    setHue((hue) => ({ ...hue, midPoint: value as any }))
                  }
                })
              }}
              onPointerUp={() => {
                prepareTransition()
                setMidPoint((midPoint) => `${roundMidPoint(Number(midPoint))}`)
              }}
              onBlur={() => {
                prepareTransition()
                setMidPoint((midPoint) => `${roundMidPoint(Number(midPoint))}`)
              }}
            />
            <datalist id={midRangeId}>
              {COLOR_TINTS.map((tint) => (
                <option key={tint} value={tint} />
              ))}
            </datalist>
          </Card>
          <Card
            tone="inherit"
            shadow={1}
            radius={1}
            marginTop={2}
            overflow="hidden"
          >
            <Suspense fallback={<Skeleton paddingY={2} animated radius={1} />}>
              <Grid columns={11} style={{ gap: '0px' }}>
                <ColorTintsPreview
                  tone={tone}
                  mid={mid}
                  // Use midPoint instead of midPointRounded as it looks and feels better when dragging the mid point slider
                  midPoint={midPoint as any}
                  lightest={lightest}
                  darkest={darkest}
                />
              </Grid>
            </Suspense>
          </Card>
        </Card>
      </Stack>
    </Card>
  )
})
