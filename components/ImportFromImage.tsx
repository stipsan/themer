import { Card, Heading, Stack, Text, TextInput } from '@sanity/ui'
import { type TransitionStartFunction, memo, useId, useState } from 'react'

const exampleUrl =
  'https://cdn.sanity.io/images/rkndubl4/themes/ed9f0a5c8d40ff7d7d23ba6ba32a00ac79eb8b00-500x750.png'
const validationMessages = {
  patternMismatch: `Only Sanity Image URLs are supported, for example: ${exampleUrl}`,
}

interface Props {
  startTransition: TransitionStartFunction
  prepareTransition: () => void
}
function ImportFromImage({ prepareTransition, startTransition }: Props) {
  const id = useId()
  const inputId = `${id}-url`
  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [validationMessage, setValidationMessage] = useState('')

  return (
    <>
      <Stack space={2}>
        <Heading size={0} muted htmlFor={inputId}>
          Image URL
        </Heading>
        <TextInput
          id={inputId}
          required={touched}
          type="url"
          muted
          pattern="^https://cdn.sanity.io/images/.+"
          fontSize={1}
          value={url}
          onFocus={() => setTouched(false)}
          onChange={(event) => {
            setUrl(event.currentTarget.value)
            prepareTransition()

            if (
              !event.currentTarget.checkValidity() ||
              !event.currentTarget.value
            ) {
              setImageUrl('')
              return
            }

            try {
              const parsed = new URL(event.currentTarget.value)
              if (
                parsed.origin !== 'https://cdn.sanity.io' ||
                !parsed.pathname.startsWith('/images/')
              ) {
                throw new Error(validationMessages.patternMismatch)
              }
              startTransition(() => setImageUrl(parsed.toString()))
              setValidationMessage('')
            } catch (err) {
              setValidationMessage(err.message)
              return
            }
          }}
          onInvalid={(event) => {
            event.preventDefault()
            if (event.currentTarget.validity.patternMismatch) {
              setValidationMessage(validationMessages.patternMismatch)
            } else {
              setValidationMessage(event.currentTarget.validationMessage)
            }
          }}
          onBlur={() => setTouched(true)}
        />
        <Card
          open
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
              Debug info
            </Text>
          </summary>
          <Text>url: {url}</Text>
          <Text>validationMessage: {validationMessage}</Text>
          <Text>imageUrl: {imageUrl}</Text>
        </Card>
      </Stack>
    </>
  )
}

export default memo(ImportFromImage)
