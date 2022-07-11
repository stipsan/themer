import {
  DesktopIcon,
  MasterDetailIcon,
  MoonIcon,
  SplitVerticalIcon,
  SunIcon,
} from '@sanity/icons'
import {
  type ThemeColorSchemeKey,
  Button,
  Card,
  Grid,
  Inline,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  Text,
  TextInput,
  ThemeProvider,
  useElementRect,
  usePrefersDark,
} from '@sanity/ui'
import Head from 'components/Head'
import Logo from 'components/Logo'
import { useMagicRouter } from 'hooks/useMagicRouter'
import { useThemeFromHues } from 'hooks/useTheme'
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
import type { Hue } from 'utils/types'

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
  position: relative;
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

export default function Index() {
  const [transition, startTransition] = useTransition()
  const [view, setView] = useState<'default' | 'split'>('default')

  const prefersDark = usePrefersDark()
  const [forceScheme, setForceScheme] = useState<ThemeColorSchemeKey | null>(
    null
  )
  const [_scheme, setScheme] = useState<ThemeColorSchemeKey>('light')
  const scheme = forceScheme ?? _scheme
  // if the preferred color scheme changes, then react to this change
  // /*
  useEffect(() => {
    const nextScheme = prefersDark ? 'dark' : 'light'
    setScheme(nextScheme)
  }, [prefersDark])
  // */

  const hues = useMemo(
    () =>
      ({
        default: {
          mid: '#8b6584',
          midPoint: 500,
          lightest: '#f7f2f5',
          darkest: '#171721',
        },
        transparent: {
          mid: '#503a4c',
          midPoint: 500,
          lightest: '#f7f2f5',
          darkest: '#171721',
        },
        primary: {
          mid: '#ec4899',
          midPoint: 500,
          lightest: '#f7f2f5',
          darkest: '#171721',
        },
        positive: {
          mid: '#10b981',
          midPoint: 500,
          lightest: '#f7f2f5',
          darkest: '#171721',
        },
        caution: {
          mid: '#fde047',
          midPoint: 500,
          lightest: '#f7f2f5',
          darkest: '#171721',
        },
        critical: {
          mid: '#fe3459',
          midPoint: 500,
          lightest: '#f7f2f5',
          darkest: '#171721',
        },
      } as const),
    []
  )
  const history = useMagicRouter('/')
  const _theme = useThemeFromHues({ hues })
  const theme = useMemo(() => {
    return {
      ..._theme,
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
  }, [_theme, view])
  console.log({ theme })
  const blogConfig = useMemo(
    () => ({ ...blog, theme, scheme }),
    [theme, scheme]
  )
  const uglyHackRef = useRef(null)
  const uglyHackRect = useElementRect(uglyHackRef.current)

  const [spins, setSpin] = useState(0)
  const spin = useCallback(
    () => startTransition(() => setSpin((spins) => ++spins)),
    []
  )
  const throttleRef = useRef(0)
  const scheduleHuesUpdate = useCallback(() => {
    if (typeof cancelIdleCallback === 'function') {
      cancelIdleCallback(throttleRef.current)
    } else {
      cancelAnimationFrame(throttleRef.current)
    }
    const scheduledUpdate = () => {
      if (!formRef.current) {
        throw new Error('No form ref')
      }

      const formData = new FormData(formRef.current)
      console.log('formData', formData)
    }

    if (typeof requestIdleCallback === 'function') {
      throttleRef.current = requestIdleCallback(scheduledUpdate, {
        timeout: 1000,
      })
    } else {
      throttleRef.current = requestAnimationFrame(scheduledUpdate)
    }
  }, [])

  const formRef = useRef(null)
  // console.log(useRouter().query)
  console.log('uglyHackRect', { uglyHackRect, uglyHackRef })
  const [resetHueFields, setResetHueFields] = useState(0)

  console.log('formRef', formRef.current)

  return (
    <>
      <Head
        lightest={theme.color.light.default.base.bg}
        darkest={theme.color.dark.default.base.bg}
      />
      <ThemeProvider theme={theme} scheme={scheme}>
        <Card height="fill" tone="transparent">
          <StyledGrid columns={[1, 1]} height="fill">
            <Card
              as="form"
              ref={formRef}
              onChange={(event) => {
                spin()
                console.log('form onchange', event)
                scheduleHuesUpdate()
              }}
              onSubmit={(event) => {
                event.preventDefault()
              }}
              height="fill"
              overflow="hidden"
              scheme={scheme}
              style={{ zIndex: 200 }}
            >
              <HeaderCard
                paddingX={[3]}
                paddingY={[2]}
                scheme="dark"
                borderRight
                shadow={scheme === 'dark' ? 1 : undefined}
              >
                <Inline>
                  <Logo spin={spins} transition={transition} />
                  <Card padding={[3]}>
                    <Text weight="semibold" muted>
                      Themer for Sanity Studio v3{' '}
                      <button onClick={() => setResetHueFields((inc) => ++inc)}>
                        reset
                      </button>
                    </Text>
                  </Card>
                </Inline>
              </HeaderCard>
              <Card borderRight height="fill" tone="default">
                <Grid columns={[2]}>
                  <Card padding={[4]}>
                    <Label htmlFor="view" size={0}>
                      View
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
                              view === 'default'
                                ? MasterDetailIcon
                                : SplitVerticalIcon
                            }
                            text={
                              view === 'default' ? 'Default' : 'Split-screen'
                            }
                          />
                        }
                        id="view"
                        menu={
                          <Menu>
                            <MenuItem
                              icon={MasterDetailIcon}
                              text={
                                view === 'default'
                                  ? 'Default'
                                  : 'Switch back to default'
                              }
                              disabled={view === 'default'}
                              onClick={() => setView('default')}
                            />
                            <MenuItem
                              icon={SplitVerticalIcon}
                              text={
                                view === 'split'
                                  ? 'Split-screen'
                                  : 'Switch to split-screen'
                              }
                              disabled={view === 'split'}
                              onClick={() => setView('split')}
                            />
                          </Menu>
                        }
                        placement="right"
                        popover={{ portal: true }}
                      />
                    </Card>
                  </Card>
                  <Card padding={[4]}>
                    <Label htmlFor="scheme" size={0}>
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
                              icon={DesktopIcon}
                              text="System"
                              disabled={forceScheme === null}
                              onClick={() => setForceScheme(null)}
                            />
                            <MenuItem
                              icon={SunIcon}
                              text="Light"
                              disabled={forceScheme === 'light'}
                              onClick={() => setForceScheme('light')}
                            />
                            <MenuItem
                              icon={MoonIcon}
                              text="Dark"
                              disabled={forceScheme === 'dark'}
                              onClick={() => setForceScheme('dark')}
                            />
                          </Menu>
                        }
                        placement="right"
                        popover={{ portal: true }}
                      />
                    </Card>
                  </Card>
                </Grid>
                <Card>Presets</Card>
                <Card borderTop height="fill" paddingY={1}>
                  {[
                    'Default',
                    'Primary',
                    'Transparent',
                    'Positive',
                    'Caution',
                    'Critical',
                  ].map((title) => {
                    return (
                      <HueFields
                        key={`${title}-${resetHueFields}`}
                        config={hues[title.toLowerCase()]}
                        title={title}
                      />
                    )
                  })}
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
                    theme={theme}
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
                    <ThemeProvider key="dark" theme={theme} scheme="dark">
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

function HueFields({ config, title }: { config: Hue; title: string }) {
  console.log('HueFields', { config })
  /**
   * Default
  lightest   mid    darkest
  color      color  color
  mid point
  |----------- dot ---------|
  Tones preview
  50 100 200 ---- 800 900 950
   */
  return (
    <Card paddingY={3} paddingX={4} tone="default">
      <Text size={2} weight="medium">
        {title}
      </Text>
      <Grid columns={[1, 3]} paddingY={3}>
        <Card>
          <Label muted size={0}>
            Lightest
          </Label>
          <Card paddingY={2}>
            <input
              name={`${title.toLowerCase()}-lightest`}
              type="color"
              defaultValue={config.lightest}
            />
            <Text
              as="output"
              muted
              size={0}
              style={{ paddingTop: '0.2rem', fontFeatureSettings: 'tnum' }}
            >
              {config.lightest}
            </Text>
          </Card>
        </Card>
        <Card hidden>
          <Label size={0}>mid</Label>
        </Card>
        <Card hidden>
          <Label size={0}>darkest</Label>
        </Card>
      </Grid>
    </Card>
  )
}

/*
// @TODO revisit later
// Using .attrs to fool the type checker as @sanity/ui isn't prepared to style it
// No worries, we're styling it here
const ColorInput = styled(TextInput).attrs({ type: 'color' as 'text' })`
flex: none;
padding: 0;
background: red

&&[type="color"] {
  ${({theme}) => {
    console.log('theme from func', theme)
    return `
    --size-diff-positive: ${theme.sanity.color.solid.positive.enabled.bg};
    --size-diff-negative: ${theme.sanity.color.solid.critical.enabled.bg};
    --input-fg-color: ${theme.sanity.color.input.default.enabled.fg};
    --input-placeholder-color: ${theme.sanity.color.input.default.enabled.placeholder};
  `
  }}
	-webkit-appearance: none;
	border: none;
	width: 32px;
	height: 32px;
  padding: 1px;
}
& [type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}
& [type="color"]::-webkit-color-swatch {
	border: none; 
}
`

// */
