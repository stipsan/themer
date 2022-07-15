import { Box, Card, Grid, Label, Text, TextArea } from '@sanity/ui'
import { memo } from 'react'
import { suspend } from 'suspend-react'

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
  projectId: string
  dataset: string
  id: string
}
function ImportFromSanityImageAsset({ projectId, dataset, id }: Props) {
  const data = suspend(async () => {
    const { default: createClient } = await import('@sanity/client')
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2022-07-10',
      useCdn: true,
    })
    const palette = await client.fetch(
      /* groq */ `*[ _type == "sanity.imageAsset" && _id == $id ][0].metadata.palette`,
      { id }
    )
    console.debug({ palette })
    return palette
  }, [projectId, dataset, id])

  return (
    <>
      <Grid columns={3} paddingTop={1}>
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
    </>
  )
}

export default memo(ImportFromSanityImageAsset)
