import {
  DesktopIcon,
  MasterDetailIcon,
  MoonIcon,
  RetrieveIcon,
  SelectIcon,
  SplitVerticalIcon,
  SunIcon,
} from '@sanity/icons'
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
  Text,
  ThemeProvider,
  useElementRect,
} from '@sanity/ui'
import Head from 'components/Head'
import HuesFields from 'components/HuesFields'
import Logo from 'components/Logo'
import PresetsMenu from 'components/PresetsMenu'
import { useMagicRouter } from 'hooks/useMagicRouter'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import { StudioLayout, StudioProvider, useColorScheme } from 'sanity'
import { config as blog } from 'studios/blog'
import styled from 'styled-components'
import { suspend } from 'suspend-react'
import type { Hue, ThemePreset } from 'utils/types'

const SIDEBAR_WIDTH = 300

// Trying to impress Snorre with my 1337 CSS haxxor
const FixNavDrawerPosition = styled(Card)`
  position: relative;

  & [data-ui='Navbar'] + div {
    top: calc(100vh - var(--ugly-hack-height, 0));
    top: calc(100dvh - var(--ugly-hack-height, 0));
    left: calc(100vw - var(--ugly-hack-width, 0));
    left: calc(100dvw - var(--ugly-hack-width, 0));
  }
`

// @TODO read the media query from the theme context instead of hardcoding to 600px
const StyledGrid = styled(Grid)`
  @media screen and (min-width: 600px) {
    gap-row: 1px;

    && {
      grid-template-columns: ${SIDEBAR_WIDTH}px 1fr;
    }
  }
`

// @TODO find a better z-index than 101
const HeaderCard = styled(Card)`
  position: sticky;
  top: 0;
  z-index: 101;
`

// @TODO workaround the fact that the Studio doesn't respect the scheme prop on the top level, the usePrefersDark hook overrides it
function SyncColorScheme({
  forceScheme,
}: {
  forceScheme: ThemeColorSchemeKey
}) {
  const { scheme, setScheme } = useColorScheme()

  useEffect(() => {
    if (scheme !== forceScheme) {
      console.log('Force syncing scheme')
      setScheme(forceScheme)
    }
  }, [scheme, forceScheme, setScheme])

  return null
}

interface Props {
  initialPreset: ThemePreset
  // The scheme detected from the usePrefersDark hook
  systemScheme: ThemeColorSchemeKey
}
export default function Themer({ systemScheme, initialPreset }: Props) {
  const [preset, setPreset] = useState(() => initialPreset)
  const [transition, startTransition] = useTransition()

  const { createTheme, initialHues } = suspend(async () => {
    const url = new URL(preset.url, location.origin)
    const [{ createTheme, hues: partialHues }, { applyHues }] =
      await Promise.all([
        import(/* webpackIgnore: true */ url.toString()),
        import('utils/applyHues'),
      ])
    return { createTheme, initialHues: applyHues(partialHues) }
  }, [preset.url])
  // used by useMemoHues, is updated by local state when syncing
  const [huesState, setHuesState] = useState(initialHues)

  // Reset the Hues state when loading a preset on demand
  useEffect(() => {
    startTransition(() => setHuesState(initialHues))
  }, [initialHues])
  // Properly memoize the hues state before passing it to the theme creator
  // const memoHues = useMemoHues(huesState)
  // Test if the JSON stringify and parsing is too costly
  const memoHues = huesState
  // Now we can create the theme from the memoed hues
  const themeFromHues = useMemo(
    () => createTheme(memoHues),
    [memoHues, createTheme]
  )

  const [view, setView] = useState<'default' | 'split'>('default')
  const [forceScheme, setForceScheme] = useState<ThemeColorSchemeKey | null>(
    null
  )
  const scheme = forceScheme ?? systemScheme

  const history = useMagicRouter('/')
  const previewTheme = useMemo(() => {
    return {
      ...themeFromHues,
      // Adjust media queries to fit the sidebar
      media:
        view === 'split'
          ? [
              360 * 2 + SIDEBAR_WIDTH,
              600 * 2 + SIDEBAR_WIDTH,
              900 * 1.5 + SIDEBAR_WIDTH,
              1200 + SIDEBAR_WIDTH,
              1800 + SIDEBAR_WIDTH / 2,
              2400,
            ]
          : [
              360 + SIDEBAR_WIDTH,
              600 + SIDEBAR_WIDTH / 2,
              900,
              1200,
              1800,
              2400,
            ],
    }
  }, [themeFromHues, view])
  const blogConfig = useMemo(
    () => ({ ...blog, theme: previewTheme, scheme }),
    [previewTheme, scheme]
  )
  const uglyHackRef = useRef(null)
  const uglyHackRect = useElementRect(uglyHackRef.current)

  const [spins, setSpin] = useState(1)
  const spin = useCallback(
    () => startTransition(() => setSpin((spins) => ++spins)),
    []
  )

  // startTransition alone is not enough, so we use a combo of requestIdleCallback if available, with a fallback to requestAnimationFrame
  // This is to avoid as much main thread jank as we can, while keeping the color picking experience as fast and delightful as the hardware allows
  const throttleRef = useRef(0)

  const onHuesChange = useCallback((tone: CardTone, hue: Hue) => {
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
      throttleRef.current = requestIdleCallback(scheduledUpdate, {
        timeout: 1000,
      })
    } else {
      throttleRef.current = requestAnimationFrame(scheduledUpdate)
    }
  }, [])

  return (
    <>
      <Head
        lightest={previewTheme.color.light.default.base.bg}
        darkest={previewTheme.color.dark.default.base.bg}
      />
      <ThemeProvider theme={previewTheme} scheme={scheme}>
        <Card
          height="fill"
          tone="transparent"
          style={{ ['color-scheme' as any]: scheme }}
        >
          <StyledGrid columns={[1, 1]} height="fill">
            <Card
              height="fill"
              overflow="auto"
              scheme={scheme}
              style={{ zIndex: 200, height: '100dvh', maxHeight: '100vh' }}
            >
              <HeaderCard
                paddingLeft={[3]}
                paddingY={[2]}
                scheme="dark"
                shadow={scheme === 'dark' ? 1 : undefined}
              >
                <Card
                  borderRight
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 1fr',
                    alignItems: 'center',
                  }}
                >
                  <Logo spin={spins} transition={transition} />
                  <Card paddingY={[3]} paddingX={[3]}>
                    <Text weight="semibold" muted style={{ flex: 2 }}>
                      Themer
                    </Text>
                  </Card>
                </Card>
              </HeaderCard>
              <Card borderRight height="fill" tone="default">
                <Grid columns={[2]}>
                  <Card padding={[4]}>
                    <Label htmlFor="view" size={0} muted>
                      View
                    </Label>
                    <Card paddingY={2}>
                      <Button
                        fontSize={1}
                        paddingY={2}
                        paddingX={3}
                        tone="default"
                        mode="ghost"
                        icon={
                          view === 'default'
                            ? SplitVerticalIcon
                            : MasterDetailIcon
                        }
                        text={
                          view === 'default' ? 'Split-screen' : 'Full-screen'
                        }
                        onClick={() =>
                          startTransition(() =>
                            setView((view) =>
                              view === 'default' ? 'split' : 'default'
                            )
                          )
                        }
                      />
                    </Card>
                  </Card>
                  <Card padding={[4]}>
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
                              disabled={forceScheme === null}
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
                              disabled={forceScheme === 'light'}
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
                              disabled={forceScheme === 'dark'}
                              onClick={() =>
                                startTransition(() => setForceScheme('dark'))
                              }
                            />
                          </Menu>
                        }
                        placement="right"
                        popover={{ portal: true }}
                      />
                    </Card>
                  </Card>
                </Grid>
                <PresetsMenu
                  selected={preset}
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
            <FixNavDrawerPosition
              ref={uglyHackRef}
              style={{
                ['--ugly-hack-width' as any]:
                  uglyHackRef?.current && uglyHackRect?.width
                    ? `${uglyHackRect.width}px`
                    : undefined,
                ['--ugly-hack-height' as any]:
                  uglyHackRef?.current && uglyHackRect?.height
                    ? `${
                        /*view === 'split'
                          ? uglyHackRect.height / 2
                          : */ uglyHackRect.height
                      }px`
                    : undefined,
              }}
            >
              <Grid
                height="fill"
                columns={[1, view === 'split' ? 2 : 1]}
                // @TODO fix rows layout
                // rows={[view === 'split' ? 2 : 1, 1]}
                /*
                  style={{
                    height: view === 'split' ? '200dvh' : '100dvh',
                    maxHeight:  view === 'split' ? '200vh' :'100vh',
                    overflow: 'auto',
                  }}
                  // */
                // @TODO fix scroll on mobile split view
                style={{
                  height: '100dvh',
                  maxHeight: '100vh',
                  overflow: 'auto',
                }}
              >
                <StudioProvider
                  key="default"
                  config={blogConfig}
                  unstable_noAuthBoundary
                  unstable_history={history}
                  scheme={view === 'split' ? 'light' : scheme}
                  // @TODO onSchemeChange doesn't work properly when using the SyncColorScheme workaround
                  // onSchemeChange={(nextScheme) => setForceScheme(nextScheme)}
                >
                  <SyncColorScheme
                    forceScheme={view === 'split' ? 'light' : scheme}
                  />
                  <ThemeProvider
                    // Workaround media queries not updating by changing the key
                    // key={view === 'split' ? 'light' : 'default'}
                    theme={previewTheme}
                    scheme={view === 'split' ? 'light' : scheme}
                  >
                    <StudioLayout />
                  </ThemeProvider>
                </StudioProvider>
                {view === 'split' && (
                  <StudioProvider
                    key="split"
                    config={blogConfig}
                    unstable_noAuthBoundary
                    unstable_history={history}
                    scheme="dark"
                    // @TODO onSchemeChange doesn't work properly when using the SyncColorScheme workaround
                    // onSchemeChange={(nextScheme) => setForceScheme(nextScheme)}
                  >
                    <SyncColorScheme forceScheme="dark" />
                    <ThemeProvider
                      key="dark"
                      theme={previewTheme}
                      scheme="dark"
                    >
                      <StudioLayout />
                    </ThemeProvider>
                  </StudioProvider>
                )}
              </Grid>
            </FixNavDrawerPosition>
          </StyledGrid>
        </Card>
      </ThemeProvider>
    </>
  )
}
