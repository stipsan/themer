import { usePrefersDark } from '@sanity/ui'
import ThemerFallback from 'components/ThemerFallback'
import { lazy, Suspense, useEffect, useState } from 'react'
import { defaultPreset, presets } from 'utils/presets'
import type { ThemePreset } from 'utils/types'

const Themer = lazy(() => import('components/Themer'))

export default function Index() {
  const prefersDark = usePrefersDark()
  const [initialPreset, setPreset] = useState<ThemePreset>(null)
  const [unstable_noAuthBoundary, setUnstable_noAuthBoundary] = useState(true)

  // Wait with loading until we know if there are custom URL parameters, which happens after mounting
  useEffect(() => {
    const initialParams = new URLSearchParams(location.search)

    if (initialParams.has('auth')) {
      setUnstable_noAuthBoundary(false)
    }

    const slug = initialParams.has('preset')
      ? initialParams.get('preset')
      : null
    const inheritFrom =
      presets.find((preset) => preset.slug === slug) || defaultPreset
    const { pathname, searchParams } = new URL(inheritFrom.url, location.origin)
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
  }, [])

  if (!initialPreset) return <ThemerFallback />

  return (
    <Suspense fallback={<ThemerFallback />}>
      <Themer
        initialPreset={initialPreset}
        sidebarWidth={300}
        systemScheme={prefersDark ? 'dark' : 'light'}
        unstable_noAuthBoundary={unstable_noAuthBoundary}
        unstable_showParsedUrl={process.env.NODE_ENV === 'development'}
      />
    </Suspense>
  )
}
