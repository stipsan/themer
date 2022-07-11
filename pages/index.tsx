import {
  type ThemeColorSchemeKey,
  BoundaryElementProvider,
  Card,
  Grid,
  PortalProvider,
  Text,
  ThemeProvider,
  usePrefersDark,
} from '@sanity/ui'
import Head from 'components/Head'
import Logo from 'components/Logo'
import { useMagicRouter } from 'hooks/useMagicRouter'
import { useThemeFromHues } from 'hooks/useTheme'
import { useEffect, useMemo, useRef, useState } from 'react'
import { StudioLayout, StudioProvider } from 'sanity'
import { ScrollContainer } from 'sanity/_unstable'
import { config as blog } from 'studios/blog'
import styled, { css } from 'styled-components'

// @TODO read the media query from the theme context instead of hardcoding to 600px
const StyledGrid = styled(Grid)`
  gap: 1px;

  @media screen and (min-width: 600px) {
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

const Scroller = styled(ScrollContainer)<{ $disabled: boolean }>(
  ({ $disabled }) => {
    if ($disabled) {
      return { height: '100%' }
    }

    return css`
      height: 100%;
      overflow: auto;
      position: relative;
      scroll-behavior: smooth;
      outline: none;
    `
  }
)

export default function Index() {
  // @TODO grab these from the theme
  const darkest = '#0f172a'
  const lightest = '#fff'

  const prefersDark = usePrefersDark()
  const [scheme, setScheme] = useState<ThemeColorSchemeKey>('light')
  // if the preferred color scheme changes, then react to this change
  useEffect(() => {
    const nextScheme = prefersDark ? 'dark' : 'light'
    setScheme(nextScheme)
  }, [prefersDark])

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

  const portalRef = useRef<HTMLDivElement | null>(null)
  const [documentScrollElement, setDocumentScrollElement] =
    useState<HTMLDivElement | null>(null)

  return (
    <>
      <Head lightest={lightest} darkest={darkest} />
      <ThemeProvider theme={theme} scheme={scheme}>
        <Card height="fill" tone="transparent">
          <StyledGrid columns={[1, 1]} height="fill">
            <Card shadow={1} height="fill" overflow="hidden">
              <HeaderCard padding={[3, 3, 4]} shadow={1}>
                <Text><Logo /> Hello world!</Text>
              </HeaderCard>
            </Card>
            <Card overflow="hidden" id="sanity">
              <PortalProvider
                element={portalRef.current}
                __unstable_elements={{
                  documentScrollElement: documentScrollElement,
                }}
              >
                <BoundaryElementProvider element={documentScrollElement}>
                  <Scroller
                    $disabled={false}
                    data-testid="sidebar-panel-scroller"
                    ref={setDocumentScrollElement}
                  >
                    <StudioProvider
                      config={blogConfig}
                      unstable_noAuthBoundary
                      unstable_history={history}
                      scheme={scheme}
                      // onSchemeChange={(nextScheme) => setScheme(nextScheme)}
                    >
                      <ThemeProvider theme={theme} scheme={scheme}>
                        <StudioLayout />
                      </ThemeProvider>
                    </StudioProvider>
                  </Scroller>

                  <div data-testid="document-panel-portal" ref={portalRef} />
                </BoundaryElementProvider>
              </PortalProvider>
            </Card>
          </StyledGrid>
        </Card>
      </ThemeProvider>
    </>
  )
}
