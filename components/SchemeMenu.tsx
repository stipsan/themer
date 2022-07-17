import { DesktopIcon, MoonIcon, SelectIcon, SunIcon } from '@sanity/icons'
import {type ThemeColorSchemeKey,Button,Card,Label,Menu,MenuButton,MenuItem,} from '@sanity/ui'
import {
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  memo,
} from 'react'

interface Props {
  forceScheme: ThemeColorSchemeKey
  setForceScheme: Dispatch<SetStateAction<ThemeColorSchemeKey>>
  startTransition: TransitionStartFunction
}
const SchemeMenu = ({
  forceScheme,
  startTransition,
  setForceScheme,
}: Props) => {
  return (
    <>
      <Label htmlFor="scheme" size={0} muted>
        Scheme
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
              icon={
                forceScheme === 'light'
                  ? SunIcon
                  : forceScheme === 'dark'
                  ? MoonIcon
                  : DesktopIcon
              }
              iconRight={SelectIcon}
              text={
                forceScheme === 'light'
                  ? 'Light'
                  : forceScheme === 'dark'
                  ? 'Dark'
                  : 'System'
              }
            />
          }
          id="scheme"
          menu={
            <Menu>
              <MenuItem
                fontSize={1}
                paddingY={2}
                paddingX={3}
                icon={DesktopIcon}
                text="System"
                selected={forceScheme === null}
                tone={forceScheme === null ? 'primary' : 'default'}
                onClick={() => startTransition(() => setForceScheme(null))}
              />
              <MenuItem
                fontSize={1}
                paddingY={2}
                paddingX={3}
                icon={SunIcon}
                text="Light"
                selected={forceScheme === 'light'}
                tone={forceScheme === 'light' ? 'primary' : 'default'}
                onClick={() => startTransition(() => setForceScheme('light'))}
              />
              <MenuItem
                fontSize={1}
                paddingY={2}
                paddingX={3}
                icon={MoonIcon}
                text="Dark"
                selected={forceScheme === 'dark'}
                tone={forceScheme === 'dark' ? 'primary' : 'default'}
                onClick={() => startTransition(() => setForceScheme('dark'))}
              />
            </Menu>
          }
          placement="bottom-start"
          popover={{ portal: true }}
        />
      </Card>
    </>
  )
}

export default memo(SchemeMenu)
