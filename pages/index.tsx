import { DesktopIcon, MoonIcon, SunIcon } from '@sanity/icons'
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
  ThemeProvider,
  usePrefersDark,
} from '@sanity/ui'
import Head from 'components/Head'
import Logo from 'components/Logo'
import { useMagicRouter } from 'hooks/useMagicRouter'
import { useThemeFromHues } from 'hooks/useTheme'
import { useEffect, useMemo, useState } from 'react'
import { StudioLayout, StudioProvider, useColorScheme } from 'sanity'
import { config as blog } from 'studios/blog'
import styled, { css } from 'styled-components'

// @TODO read the media query from the theme context instead of hardcoding to 600px
const StyledGrid = styled(Grid)`
  @media screen and (min-width: 600px) {
    gap-row: 1px;

    && {
      grid-template-columns: 300px 1fr;
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
  // @TODO grab these from the theme
  const darkest = '#0f172a'
  const lightest = '#fff'

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
  const theme = useThemeFromHues({ hues })
  const blogConfig = useMemo(
    () => ({ ...blog, theme, scheme }),
    [theme, scheme]
  )
  // console.log(useRouter().query)
  console.log('scheme', { scheme })

  return (
    <>
      <Head lightest={lightest} darkest={darkest} />
      <ThemeProvider theme={theme} scheme={scheme}>
        <Card height="fill" tone="transparent">
          <StyledGrid columns={[1, 1]} height="fill">
            <Card height="fill" overflow="hidden" scheme={scheme}>
              <HeaderCard
                paddingX={[3]}
                paddingY={[2]}
                scheme="dark"
                borderRight
                shadow={scheme === 'dark' ? 1 : undefined}
              >
                <Inline>
                  <Logo spin />
                  <Card padding={[3]}>
                    <Text weight="semibold" muted>
                      Themer for Sanity Studio v3
                    </Text>
                  </Card>
                </Inline>
              </HeaderCard>
              <Card borderRight height="fill" tone="default">
                <Grid columns={[1, 2]}>
                  <Card padding={[3, 4, 4]}>
                    <Label htmlFor="view" size={1}>
                      View
                    </Label>
                  </Card>
                  <Card padding={[3, 4, 4]}>
                    <Label htmlFor="scheme" size={1}>
                      Scheme
                    </Label>
                    <Card paddingY={2}>
                      <MenuButton
                        button={
                          <Button
                            fontSize={2}
                            padding={3}
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
                        placement="left"
                        popover={{ portal: true }}
                      />
                    </Card>
                  </Card>
                </Grid>
              </Card>
            </Card>
            <Card>
              <StudioProvider
                config={blogConfig}
                unstable_noAuthBoundary
                unstable_history={history}
                scheme={scheme}
                // @TODO onSchemeChange doesn't work properly when using the SyncColorScheme workaround
                // onSchemeChange={(nextScheme) => setForceScheme(nextScheme)}
              >
                <SyncColorScheme forceScheme={scheme} />
                <ThemeProvider theme={theme} scheme={scheme}>
                  <StudioLayout />
                </ThemeProvider>
              </StudioProvider>
            </Card>
          </StyledGrid>
        </Card>
      </ThemeProvider>
    </>
  )
}
