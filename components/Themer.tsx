import { DesktopIcon, MoonIcon, SelectIcon, SunIcon } from '@sanity/icons'
import {
  type CardTone,
  type ThemeColorSchemeKey,
  Button,
  Card,
  Grid,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  ThemeProvider,
} from '@sanity/ui'
import Head from 'components/Head'
import { HeaderCard, useHeaderCard } from 'components/HeaderCard'
import HuesFields from 'components/HuesFields'
import PresetsMenu from 'components/PresetsMenu'
import { StudioViewer, useStudioViewer } from 'components/StudioViewer'
import ToggleView from 'components/ToggleView'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { StudioTheme } from 'sanity'
import { config } from 'studios'
import styled from 'styled-components'
import { suspend } from 'suspend-react'
import type { PartialDeep } from 'type-fest'
import { roundMidPointToScale } from 'utils/roundMidPointToScale'
import type { Hue, Hues, ThemePreset } from 'utils/types'

// @TODO read the media query from the theme context instead of hardcoding to 600px
const StyledGrid = styled(Grid)`
  @media screen and (min-width: 600px) {
    gap-row: 1px;

    && {
      grid-template-columns: ${
          // @ts-expect-error
          ({ sidebarWidth }) => sidebarWidth
        }px 1fr;
    }
  }
`

interface Props {
  initialPreset: ThemePreset
  sidebarWidth: number
  // The scheme detected from the usePrefersDark hook
  systemScheme: ThemeColorSchemeKey
}
export default function Themer({
  sidebarWidth,
  systemScheme,
  initialPreset,
}: Props) {
  const [preset, setPreset] = useState(() => initialPreset)

  const { createTheme, initialHues } = suspend(async () => {
    const url = new URL(preset.url, location.origin)
    const [{ createTheme, hues: partialHues }, { applyHues }] =
      await Promise.all([
        import(/* webpackIgnore: true */ url.toString()),
        import('utils/applyHues'),
      ])
    return {
      createTheme: createTheme as (hues: PartialDeep<Hues>) => StudioTheme,
      initialHues: applyHues(partialHues),
    }
  }, [preset.url])
  // used by useMemoHues, is updated by local state when syncing
  const [huesState, setHuesState] = useState(initialHues)

  const { spin, spins, transition, startTransition } = useHeaderCard()

  const { view, toggleView } = useStudioViewer({ startTransition })

  // Reset the Hues state when loading a preset on demand
  useEffect(() => {
    startTransition(() => setHuesState(initialHues))
  }, [initialHues, startTransition])
  // Properly memoize the hues state before passing it to the theme creator
  // const memoHues = useMemoHues(huesState)
  // Test if the JSON stringify and parsing is too costly
  const memoHues = huesState
  // Now we can create the theme from the memoed hues
  const themeFromHues = useMemo(
    () => createTheme(memoHues),
    [memoHues, createTheme]
  )

  // Backup hue edits to the current URL
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('preset', preset.slug)
    url.searchParams.set(
      'default',
      `${memoHues.default.mid.replace(/^#/, '')};${roundMidPointToScale(
        memoHues.default.midPoint
      )};lightest:${memoHues.default.lightest.replace(
        /^#/,
        ''
      )};darkest:${memoHues.default.darkest.replace(/^#/, '')}`
    )
    url.searchParams.set(
      'primary',
      `${memoHues.primary.mid.replace(/^#/, '')};${roundMidPointToScale(
        memoHues.primary.midPoint
      )};lightest:${memoHues.primary.lightest.replace(
        /^#/,
        ''
      )};darkest:${memoHues.primary.darkest.replace(/^#/, '')}`
    )
    url.searchParams.set(
      'transparent',
      `${memoHues.transparent.mid.replace(/^#/, '')};${roundMidPointToScale(
        memoHues.transparent.midPoint
      )};lightest:${memoHues.transparent.lightest.replace(
        /^#/,
        ''
      )};darkest:${memoHues.transparent.darkest.replace(/^#/, '')}`
    )
    url.searchParams.set(
      'positive',
      `${memoHues.positive.mid.replace(/^#/, '')};${roundMidPointToScale(
        memoHues.positive.midPoint
      )};lightest:${memoHues.positive.lightest.replace(
        /^#/,
        ''
      )};darkest:${memoHues.positive.darkest.replace(/^#/, '')}`
    )
    url.searchParams.set(
      'caution',
      `${memoHues.caution.mid.replace(/^#/, '')};${roundMidPointToScale(
        memoHues.caution.midPoint
      )};lightest:${memoHues.caution.lightest.replace(
        /^#/,
        ''
      )};darkest:${memoHues.caution.darkest.replace(/^#/, '')}`
    )
    url.searchParams.set(
      'critical',
      `${memoHues.critical.mid.replace(/^#/, '')};${roundMidPointToScale(
        memoHues.critical.midPoint
      )};lightest:${memoHues.critical.lightest.replace(
        /^#/,
        ''
      )};darkest:${memoHues.critical.darkest.replace(/^#/, '')}`
    )
    window.history.replaceState({}, '', decodeURIComponent(url.href))
  }, [memoHues, preset.slug])

  const [forceScheme, setForceScheme] = useState<ThemeColorSchemeKey | null>(
    null
  )
  const scheme = forceScheme ?? systemScheme

  // startTransition alone is not enough, so we use a combo of requestIdleCallback if available, with a fallback to requestAnimationFrame
  // This is to avoid as much main thread jank as we can, while keeping the color picking experience as fast and delightful as the hardware allows
  const throttleRef = useRef(0)

  const onHuesChange = useCallback(
    (tone: CardTone, hue: Hue) => {
      if (typeof cancelIdleCallback === 'function') {
        cancelIdleCallback(throttleRef.current)
      } else {
        cancelAnimationFrame(throttleRef.current)
      }
      const scheduledUpdate = () => {
        startTransition(() => {
          setHuesState((prev) => ({ ...prev, [tone]: hue }))
        })
      }

      if (typeof requestIdleCallback === 'function') {
        throttleRef.current = requestIdleCallback(scheduledUpdate)
      } else {
        throttleRef.current = requestAnimationFrame(scheduledUpdate)
      }
    },
    [startTransition]
  )

  return (
    <ThemeProvider theme={themeFromHues} scheme={scheme}>
      <Head />
      <Card
        height="fill"
        tone="transparent"
        style={{ ['color-scheme' as any]: scheme }}
      >
        <StyledGrid
          columns={[1, 1]}
          height="fill"
          // @ts-expect-error
          sidebarWidth={sidebarWidth}
        >
          <Card
            height="fill"
            overflow="auto"
            scheme={scheme}
            style={{ zIndex: 200, height: '100dvh', maxHeight: '100vh' }}
          >
            <HeaderCard scheme={scheme} spins={spins} transition={transition} />
            <Card borderRight height="fill" tone="default">
              <Grid
                columns={[2]}
                paddingBottom={2}
                style={{ paddingLeft: 'env(safe-area-inset-left)' }}
              >
                <Card paddingLeft={[4]} paddingTop={4}>
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
                            onClick={() =>
                              startTransition(() => setForceScheme(null))
                            }
                          />
                          <MenuItem
                            fontSize={1}
                            paddingY={2}
                            paddingX={3}
                            icon={SunIcon}
                            text="Light"
                            selected={forceScheme === 'light'}
                            tone={
                              forceScheme === 'light' ? 'primary' : 'default'
                            }
                            onClick={() =>
                              startTransition(() => setForceScheme('light'))
                            }
                          />
                          <MenuItem
                            fontSize={1}
                            paddingY={2}
                            paddingX={3}
                            icon={MoonIcon}
                            text="Dark"
                            selected={forceScheme === 'dark'}
                            tone={
                              forceScheme === 'dark' ? 'primary' : 'default'
                            }
                            onClick={() =>
                              startTransition(() => setForceScheme('dark'))
                            }
                          />
                        </Menu>
                      }
                      placement="bottom-start"
                      popover={{ portal: true }}
                    />
                  </Card>
                </Card>
                <Card paddingTop={[4]}>
                  <ToggleView toggleView={toggleView} view={view} />
                </Card>
              </Grid>
              <PresetsMenu
                hues={memoHues}
                selected={preset}
                prepareTransition={spin}
                startTransition={startTransition}
                setPreset={setPreset}
                onChange={(nextPreset) =>
                  startTransition(() => setPreset(nextPreset))
                }
              />
              <Card height="fill" paddingY={1}>
                <HuesFields
                  initialHues={initialHues}
                  startTransition={startTransition}
                  prepareTransition={spin}
                  onChange={onHuesChange}
                />
              </Card>
            </Card>
          </Card>
          <StudioViewer
            config={config}
            scheme={scheme}
            sidebarWidth={sidebarWidth}
            theme={themeFromHues}
            view={view}
          />
        </StyledGrid>
      </Card>
    </ThemeProvider>
  )
}
