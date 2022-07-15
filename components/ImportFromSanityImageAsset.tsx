import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  Label,
  Text,
  TextArea,
} from '@sanity/ui'
import {
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  memo,
} from 'react'
import { suspend } from 'suspend-react'
import { getMidPointFromLuminance } from 'utils/getMidPointFromLuminance'
import type { ThemePreset } from 'utils/types'

const colorStyle = {
  boxSizing: 'border-box',
  background: 'var(--card-border-color)',
  border: '1px solid var(--card-border-color)',
  borderRadius: '2px',
  padding: '0px 2px',
  appearance: 'none',
  margin: 0,
}

interface Props {
  startTransition: TransitionStartFunction
  setPreset: Dispatch<SetStateAction<ThemePreset>>
  projectId: string
  dataset: string
  id: string
}
function ImportFromSanityImageAsset({
  projectId,
  dataset,
  id,
  startTransition,
  setPreset,
}: Props) {
  const data = suspend(async () => {
    const url = new URL(
      `/api/palette/${projectId}/${dataset}/${id}`,
      location.origin
    )
    const res = await fetch(url)
    const palette = await res.json()
    /*
    const { default: createClient } = await import('@sanity/client')
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2022-07-10',
      useCdn: true,
    })
    const palette = await client.fetch(
      `*[ _type == "sanity.imageAsset" && _id == $id ][0].metadata.palette`,
      { id }
      )
      console.debug({ palette })
      // */
    return palette
  }, [projectId, dataset, id])

  return (
    <>
      <Card
        as="details"
        tone="transparent"
        muted
        radius={2}
        paddingX={2}
        paddingY={1}
      >
        <summary style={{ position: 'relative' }}>
          <Text
            size={1}
            muted
            style={{
              display: 'inline-block',
              position: 'absolute',
              top: '0.25rem',
              left: '1rem',
            }}
          >
            Color Palette
          </Text>
        </summary>
        <Grid columns={3} paddingTop={2}>
          <Box>
            <Text muted size={0}>
              muted
            </Text>
            <Box paddingY={2}>
              <input
                type="color"
                readOnly
                style={colorStyle as any}
                value={data?.muted?.background}
              />
              <Text
                as="output"
                muted
                size={0}
                style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
              >
                {data?.muted?.background}
              </Text>
            </Box>
          </Box>
          <Box>
            <Text muted size={0}>
              lightMuted
            </Text>
            <Box paddingY={2}>
              <input
                type="color"
                readOnly
                style={colorStyle as any}
                value={data?.lightMuted?.background}
              />
              <Text
                as="output"
                muted
                size={0}
                style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
              >
                {data?.lightMuted?.background}
              </Text>
            </Box>
          </Box>
          <Box>
            <Text muted size={0}>
              darkMuted
            </Text>
            <Box paddingY={2}>
              <input
                type="color"
                readOnly
                style={colorStyle as any}
                value={data?.darkMuted?.background}
              />
              <Text
                as="output"
                muted
                size={0}
                style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
              >
                {data?.darkMuted?.background}
              </Text>
            </Box>
          </Box>
        </Grid>
        <Grid columns={3} paddingTop={1}>
          <Box>
            <Text muted size={0}>
              vibrant
            </Text>
            <Box paddingY={2}>
              <input
                type="color"
                readOnly
                style={colorStyle as any}
                value={data?.vibrant?.background}
              />
              <Text
                as="output"
                muted
                size={0}
                style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
              >
                {data?.vibrant?.background}
              </Text>
            </Box>
          </Box>
          <Box>
            <Text muted size={0}>
              lightVibrant
            </Text>
            <Box paddingY={2}>
              <input
                type="color"
                readOnly
                style={colorStyle as any}
                value={data?.lightVibrant?.background}
              />
              <Text
                as="output"
                muted
                size={0}
                style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
              >
                {data?.lightVibrant?.background}
              </Text>
            </Box>
          </Box>
          <Box>
            <Text muted size={0}>
              darkVibrant
            </Text>
            <Box paddingY={2}>
              <input
                type="color"
                readOnly
                style={colorStyle as any}
                value={data?.darkVibrant?.background}
              />
              <Text
                as="output"
                muted
                size={0}
                style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
              >
                {data?.darkVibrant?.background}
              </Text>
            </Box>
          </Box>
        </Grid>
        <Box paddingTop={1}>
          <Text muted size={0}>
            dominant
          </Text>
          <Box paddingY={2}>
            <input
              type="color"
              readOnly
              style={colorStyle as any}
              value={data?.dominant?.background}
            />
            <Text
              as="output"
              muted
              size={0}
              style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
            >
              {data?.dominant?.background}
            </Text>
          </Box>
        </Box>
      </Card>
      <Heading size={0} muted>
        Choose a variant
      </Heading>
      <Grid columns={2} gap={1}>
        <Button
          fontSize={1}
          paddingY={2}
          paddingX={3}
          text="Dominant"
          tone="primary"
          onClick={() => {
            startTransition(() =>
              setPreset((prev) => {
                const { pathname, searchParams } = new URL(
                  prev.url,
                  location.origin
                )
                const mid = data.dominant.background
                const midPoint = getMidPointFromLuminance(mid)
                searchParams.set(
                  'default',
                  `${mid.replace(/^#/, '')};${midPoint}`
                )
                searchParams.set(
                  'transparent',
                  `${mid.replace(/^#/, '')};${midPoint}`
                )
                const primary =
                  data.dominant.background === data.vibrant.background
                    ? data.lightVibrant.background
                    : data.vibrant.background
                const primaryMidPoint = getMidPointFromLuminance(primary)
                searchParams.set(
                  'primary',
                  `${primary.replace(/^#/, '')};${primaryMidPoint}`
                )
                return {
                  ...prev,
                  url: `${pathname}?${searchParams.toString()}`,
                }
              })
            )
          }}
        />
      </Grid>
    </>
  )
}

export default memo(ImportFromSanityImageAsset)
