import { WarningOutlineIcon } from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  Label,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import {
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  memo,
  useId,
  useMemo,
  useState,
} from 'react'
import type { ThemePreset } from 'utils/types'

import ImportFromSanityImageAsset from './ImportFromSanityImageAsset'

const exampleUrl =
  'https://cdn.sanity.io/images/rkndubl4/themes/ed9f0a5c8d40ff7d7d23ba6ba32a00ac79eb8b00-500x750.png'
const validationMessages = {
  patternMismatch: `Only Sanity Image URLs are supported`,
}

interface Props {
  startTransition: TransitionStartFunction
  setPreset: Dispatch<SetStateAction<ThemePreset>>
  prepareTransition: () => void
}
function ImportFromImage({
  prepareTransition,
  startTransition,
  setPreset,
}: Props) {
  const id = useId()
  const inputId = `${id}-url`
  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const asset = useMemo(() => {
    try {
      const url = new URL(imageUrl)
      const [, , projectId, dataset, _id] = url.pathname.split('/')
      const id = `image-${_id.split('.').join('-')}`
      return { projectId, dataset, id }
    } catch {
      return { projectId: '', dataset: '', id: '' }
    }
  }, [imageUrl])

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
          fontSize={[2, 2, 1]}
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
        {validationMessage && (
          <Card tone="caution">
            <Grid
              paddingX={1}
              paddingY={3}
              columns={2}
              style={{ alignItems: 'center', gridTemplateColumns: '22px 1fr' }}
            >
              <WarningOutlineIcon />
              <Text size={0} style={{ wordBreak: 'break-word' }}>
                {validationMessage}
              </Text>
            </Grid>
          </Card>
        )}
        {!imageUrl && (
          <Button
            fontSize={1}
            paddingY={2}
            paddingX={3}
            text="Demo"
            tone="primary"
            onClick={() => {
              setUrl(exampleUrl)
              prepareTransition()
              setValidationMessage('')
              startTransition(() => setImageUrl(exampleUrl))
            }}
          />
        )}
        <Card
          as="details"
          tone="transparent"
          muted
          radius={2}
          paddingX={2}
          paddingY={1}
        >
          <summary
            style={{
              position: 'relative',
              color: 'var(--card-muted-fg-color)',
            }}
          >
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
              Parsed URL
            </Text>
          </summary>
          <Stack space={1} paddingY={2}>
            <Label size={0}>URL</Label>
            <TextInput fontSize={0} readOnly value={imageUrl} />
            <Grid columns={2} paddingY={1} gap={1}>
              <Stack space={1}>
                <Label size={0}>Project ID</Label>
                <TextInput fontSize={0} readOnly value={asset.projectId} />
              </Stack>
              <Stack space={1}>
                <Label size={0}>Dataset</Label>
                <TextInput fontSize={0} readOnly value={asset.dataset} />
              </Stack>
            </Grid>
            <Label size={0}>Image Asset Ref</Label>
            <TextInput fontSize={0} readOnly value={asset.id} />
          </Stack>
        </Card>
        {asset.projectId && asset.dataset && asset.id && (
          <ImportFromSanityImageAsset
            projectId={asset.projectId}
            dataset={asset.dataset}
            id={asset.id}
            startTransition={startTransition}
            setPreset={setPreset}
          />
        )}
      </Stack>
    </>
  )
}

export default memo(ImportFromImage)
