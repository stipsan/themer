import { Box, Card, Text, Tooltip } from '@sanity/ui'
import { memo } from 'react'
import { createTintsFromHue } from 'utils/createTonesFromHues'
import type { Hue } from 'utils/types'

function ColorTintsPreview({ hue, title }: { hue: Hue; title: string }) {
  const tints = createTintsFromHue(hue, title)
  return (
    <>
      {Object.entries(tints).map(([tint, color]) => (
        <Tooltip
          key={tint}
          content={
            <Card tone="default" key={tint} radius={2}>
              <Card
                padding={4}
                radius={2}
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
          fallbackPlacements={['top-end', 'top-start']}
          placement="top"
          portal
        >
          <Box
            style={{
              background: color.hex,
              boxShadow: 'var(--card-shadow-outline-color) -1px 0px 0 0',
            }}
            paddingY={2}
          />
        </Tooltip>
      ))}
    </>
  )
}

export default memo(ColorTintsPreview)
