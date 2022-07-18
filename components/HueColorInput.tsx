import { Card, Stack, Text } from '@sanity/ui'
import { ColorInput, Label } from 'components/Sidebar.styles'
import { type ChangeEventHandler, memo } from 'react'

interface Props {
  label: string
  onChange: ChangeEventHandler<HTMLInputElement>
  // @TODO use TS template string types to make sure a valid hex string is given
  value: string
}
const HueColorInput = ({ label, onChange, value }: Props) => {
  return (
    <Stack space={2}>
      <Label>{label}</Label>
      <Card>
        <ColorInput value={value} onChange={onChange} />
        <Text
          as="output"
          muted
          size={0}
          style={{ paddingTop: '0.4rem', fontFeatureSettings: 'tnum' }}
        >
          {value}
        </Text>
      </Card>
    </Stack>
  )
}

export default memo(HueColorInput)
