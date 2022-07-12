import { MusicNoteIcon } from '@heroicons/react/outline'
import { MasterDetailIcon } from '@sanity/icons'
import { Button, Card, Label, Menu, MenuButton, MenuItem } from '@sanity/ui'
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
  return (
    <Card>
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
                text={selected.title}
              />
            }
            id="view"
            menu={
              <Menu>
                {presets.map((_preset) => {
                  const { slug, icon, title } = _preset
                  return (
                    <MenuItem
                      fontSize={1}
                      paddingY={2}
                      paddingX={3}
                      key={slug}
                      disabled={selected.slug === slug}
                      icon={icon ?? iconFromSlug(slug)}
                      text={title}
                      onClick={() => void onChange(_preset)}
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
    </Card>
  )
}
