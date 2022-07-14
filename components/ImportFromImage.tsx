import { Heading, Stack, TextInput } from '@sanity/ui'
import { memo, useId, useState } from 'react'

interface Props {}
function ImportFromImage(props: Props) {
  const id = useId()
  const inputId = `${id}-url`
  const [url, setUrl] = useState('')

  return (
    <>
      <Stack space={2}>
        <Heading size={0} muted htmlFor={inputId}>
          Image URL
        </Heading>
        <TextInput id={inputId} type="url" muted fontSize={1} />
      </Stack>
    </>
  )
}

export default memo(ImportFromImage)
