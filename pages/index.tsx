import {
  Card,
  Flex,
  Spinner,
  studioTheme,
  Text,
  ThemeProvider,
  usePrefersDark,
} from '@sanity/ui'
import Head from 'components/Head'
import Themer from 'components/Themer'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useState } from 'react'
import { presets } from 'utils/presets'

const fallback = (
  <ThemeProvider scheme="light" theme={studioTheme}>
    <Head
      lightest={studioTheme.color.light.default.base.bg}
      darkest={studioTheme.color.dark.default.base.bg}
    />
    <Card height="fill" tone="transparent">
      <Flex
        align="center"
        direction="column"
        gap={4}
        justify="center"
        padding={6}
        sizing="border"
        height="fill"
      >
        <Text muted>Loading…</Text>
        <Spinner muted />
      </Flex>
    </Card>
  </ThemeProvider>
)

export default function Index() {
  const { isReady } = useRouter()
  const [themeUrl, setThemeUrl] = useState<string>(null)
  const prefersDark = usePrefersDark()

  // Wait with loading until we know if there are custom URL parameters, which happens after mounting
  useEffect(() => {
    // @TODO is it necessary to wait for isReady  when using URLSearchParams?
    if (isReady && !themeUrl) {
      const searchParams = new URLSearchParams(
        process.env.NODE_ENV === 'production' ? '?min' : ''
      )
      const initialParams = new URLSearchParams(location.search)

      const maybePreset = initialParams.has('preset')
        ? initialParams.get('preset')
        : null
      if (maybePreset) {
        const preset = presets.find((preset) => preset.slug === maybePreset)
        if (preset) {
          const url = new URL(preset.url, location.origin)
          setThemeUrl(url.toString())

          return
        }
      }

      const paramsAllowlist = [
        'lightest',
        'darkest',
        'default',
        'primary',
        'transparent',
        'positive',
        'caution',
        'critical',
        'min',
      ]
      for (const key of paramsAllowlist) {
        console.log(key)
        if (initialParams.has(key)) {
          searchParams.set(key, initialParams.get(key))
        }
      }

      const url = new URL(
        `/api/hues?${decodeURIComponent(searchParams.toString())}`,
        location.origin
      )
      setThemeUrl(url.toString())
    }
  }, [isReady, themeUrl])

  if (!themeUrl) return fallback

  return (
    <Suspense fallback={fallback}>
      <Themer
        themeUrl={themeUrl}
        systemScheme={prefersDark ? 'dark' : 'light'}
      />
    </Suspense>
  )
}
