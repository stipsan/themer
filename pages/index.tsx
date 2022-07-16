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
import { useRouter } from 'next/router'
import { lazy, Suspense, useEffect, useState } from 'react'
import { defaultPreset, presets } from 'utils/presets'
import type { ThemePreset } from 'utils/types'

const Themer = lazy(() => import('components/Themer'))

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
  const prefersDark = usePrefersDark()
  const [initialPreset, setPreset] = useState<ThemePreset>(null)
  const readyToInit = isReady && !initialPreset

  // Wait with loading until we know if there are custom URL parameters, which happens after mounting
  useEffect(() => {
    // @TODO is it necessary to wait for isReady  when using URLSearchParams?
    if (readyToInit) {
      const initialParams = new URLSearchParams(location.search)
      const slug = initialParams.has('preset')
        ? initialParams.get('preset')
        : null
      const inheritFrom =
        presets.find((preset) => preset.slug === slug) || defaultPreset
      const { pathname, searchParams } = new URL(
        inheritFrom.url,
        location.origin
      )
      if (process.env.NODE_ENV === 'production') searchParams.set('min', '1')

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
        if (initialParams.has(key)) {
          searchParams.set(key, initialParams.get(key))
        }
      }

      console.log(searchParams.toString())
      const url = new URL(
        `${pathname}?${decodeURIComponent(searchParams.toString())}`,
        location.origin
      )
      setPreset({ ...inheritFrom, url: url.toString() })
    }
  }, [readyToInit])

  if (!initialPreset) return fallback

  return (
    <Suspense fallback={fallback}>
      <Themer
        initialPreset={initialPreset}
        systemScheme={prefersDark ? 'dark' : 'light'}
      />
    </Suspense>
  )
}
