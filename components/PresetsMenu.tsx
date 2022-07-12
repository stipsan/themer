// SquareIcon use for single view menu

import { MusicNoteIcon } from '@heroicons/react/outline'
import { DownloadIcon,MasterDetailIcon, PackageIcon, SelectIcon, UploadIcon } from '@sanity/icons'
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
  Text,
} from '@sanity/ui'
import { useState } from 'react'
import styled from 'styled-components'
import { presets } from 'utils/presets'
import type { ThemePreset } from 'utils/types'

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
}
export default function PresetsMenu({ selected, onChange }: Props) {
  const [open, setOpen] = useState<'upload' | 'share' | 'download' | false>(false)

  return (<>
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
                //onClick={() => void onChange(_preset)}
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
                //onClick={() => void onChange(_preset)}
              />
              <MenuItem
                fontSize={1}
                paddingY={2}
                paddingX={3}
                icon={DownloadIcon}
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
                    tone={active? 'primary' : 'default'}
                    selected={active}
                    onClick={active?undefined:() => void onChange(_preset)}
                    
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
    {
  open === 'upload' && (
    <Dialog
      header="Example"
      id="dialog-example"
      onClose={() => setOpen(false)}
      zOffset={1000}
    >
      <Box padding={4}>
        <Text>Content</Text>
      </Box>
    </Dialog>
  )
}
  </>
  )
}
