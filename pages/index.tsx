import {
  type ThemeColorSchemeKey,
  Card,
  Grid,
  Text,
  ThemeProvider,
} from '@sanity/ui'
import Head from 'components/Head'
import { useMagicRouter } from 'hooks/useMagicRouter'
import { useThemeFromHues } from 'hooks/useTheme'
import { useMemo, useState } from 'react'
import { StudioLayout, StudioProvider } from 'sanity'
import { config as blog } from 'studios/blog'
import styled from 'styled-components'

// @TODO read the media query from the theme context instead of hardcoding to 600px
const StyledGrid = styled(Grid)`
  @media screen and (min-width: 600px) {
    && {
      grid-template-columns: 300px 1fr;
    }
  }
`

export default function Index() {
  // @TODO grab these from the theme
  const darkest = '#0f172a'
  const lightest = '#fff'

  const [scheme, setScheme] = useState<ThemeColorSchemeKey>('light')
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
        <Card height="fill" tone="default">
          <StyledGrid columns={[1, 1]} height="fill">
            <Card padding={[3, 3, 4]} shadow={1}>
              <Text>Hello world!</Text>
            </Card>
            <Card shadow={1}>
              <StudioProvider
                config={blogConfig}
                unstable_noAuthBoundary
                unstable_history={history}
                onSchemeChange={(nextScheme) => setScheme(nextScheme)}
              >
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
