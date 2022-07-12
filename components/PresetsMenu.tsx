// SquareIcon use for single view menu

import { MusicNoteIcon } from '@heroicons/react/outline'
import {
  DownloadIcon,
  LaunchIcon,
  MasterDetailIcon,
  PackageIcon,
  SelectIcon,
  UploadIcon,
} from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Dialog,
  Label,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { presets } from 'utils/presets'
import type { Hues, ThemePreset } from 'utils/types'

const SynthWaveIcon = styled(MusicNoteIcon)`
  width: 16px;
  stroke-width: 1.4;
`

// @TODO React.lazy these icons
const iconFromSlug = (slug: string) => {
  return slug === 'pink-synth'
    ? SynthWaveIcon
    : slug === 'default'
    ? MasterDetailIcon
    : undefined
}

interface Props {
  onChange: (preset: ThemePreset) => void
  selected: ThemePreset
  hues: Hues
}
export default function PresetsMenu({ selected, onChange, hues }: Props) {
  const [open, setOpen] = useState<'upload' | 'share' | 'download' | false>(
    false
  )

  const shareLink = useMemo(() => {
    const searchParams = new URLSearchParams()
    searchParams.set('preset', selected.slug)
    // default, primary, transparent, positive, caution, critical
    searchParams.set(
      'default',
      `${hues.default.mid.replace(/^#/, '')};${
        hues.default.midPoint
      };lightest:${hues.default.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.default.darkest.replace(/^#/, '')}`
    )
    searchParams.set(
      'primary',
      `${hues.primary.mid.replace(/^#/, '')};${
        hues.primary.midPoint
      };lightest:${hues.primary.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.primary.darkest.replace(/^#/, '')}`
    )
    searchParams.set(
      'transparent',
      `${hues.transparent.mid.replace(/^#/, '')};${
        hues.transparent.midPoint
      };lightest:${hues.transparent.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.transparent.darkest.replace(/^#/, '')}`
    )
    searchParams.set(
      'positive',
      `${hues.positive.mid.replace(/^#/, '')};${
        hues.positive.midPoint
      };lightest:${hues.positive.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.positive.darkest.replace(/^#/, '')}`
    )
    searchParams.set(
      'caution',
      `${hues.caution.mid.replace(/^#/, '')};${
        hues.caution.midPoint
      };lightest:${hues.caution.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.caution.darkest.replace(/^#/, '')}`
    )
    searchParams.set(
      'critical',
      `${hues.critical.mid.replace(/^#/, '')};${
        hues.critical.midPoint
      };lightest:${hues.critical.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.critical.darkest.replace(/^#/, '')}`
    )

    const url = new URL(
      `/?${decodeURIComponent(searchParams.toString())}`,
      location.origin
    )

    return url.toString()
  }, [hues, selected.slug])

  return (
    <>
      <Card paddingX={[4]} paddingBottom={2}>
        <Label htmlFor="presets" size={0} muted>
          Presets
        </Label>
        <Card paddingY={2}>
          <MenuButton
            button={
              <Button
                fontSize={1}
                paddingY={2}
                paddingX={3}
                tone="default"
                mode="ghost"
                icon={selected.icon ?? iconFromSlug(selected.slug)}
                iconRight={SelectIcon}
                text={selected.title}
              />
            }
            id="presets"
            menu={
              <Menu>
                <MenuItem
                  fontSize={1}
                  paddingY={2}
                  paddingX={3}
                  //key={slug}
                  //disabled={selected.slug === slug}
                  // icon={icon ?? iconFromSlug(slug)}
                  icon={UploadIcon}
                  text={'Upload'}
                  onClick={() => void setOpen('upload')}
                />
                <MenuItem
                  fontSize={1}
                  paddingY={2}
                  paddingX={3}
                  //key={slug}
                  icon={PackageIcon}
                  //disabled={selected.slug === slug}
                  // icon={icon ?? iconFromSlug(slug)}
                  text={'Share'}
                  onClick={() => void setOpen('share')}
                  //onClick={() => void onChange(_preset)}
                />
                <MenuItem
                  fontSize={1}
                  paddingY={2}
                  paddingX={3}
                  icon={DownloadIcon}
                  onClick={() => void setOpen('download')}
                  //key={slug}
                  //disabled={selected.slug === slug}
                  // icon={icon ?? iconFromSlug(slug)}
                  text={'Download'}
                  //onClick={() => void onChange(_preset)}
                />
                <MenuDivider />
                {presets.map((_preset) => {
                  const { slug, icon, title } = _preset
                  const active = selected.slug === slug
                  return (
                    <MenuItem
                      fontSize={1}
                      paddingY={2}
                      paddingX={3}
                      key={slug}
                      icon={icon ?? iconFromSlug(slug)}
                      text={title}
                      tone={active ? 'primary' : 'default'}
                      selected={active}
                      onClick={
                        active ? undefined : () => void onChange(_preset)
                      }
                    />
                  )
                })}
              </Menu>
            }
            placement="right"
            popover={{ portal: true }}
          />
        </Card>
      </Card>
      {open === 'upload' && (
        <Dialog
          key="upload"
          header="Upload"
          id="dialog-upload-preset"
          onClose={() => setOpen(false)}
          zOffset={1000}
        >
          <Box padding={4}>
            <Text>Todo</Text>
          </Box>
        </Dialog>
      )}
      {open === 'share' && (
        <Dialog
          key="share"
          header="Share"
          id="dialog-share-preset"
          onClose={() => setOpen(false)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text>
                Share this link to let others try out your Studio v3 theme.
              </Text>
              <TextInput readOnly value={shareLink} />
              <Button icon={LaunchIcon} as="a" href={shareLink} text="Open" />
            </Stack>
          </Box>
        </Dialog>
      )}
    </>
  )
}
