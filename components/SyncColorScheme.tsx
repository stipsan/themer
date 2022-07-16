import { type ThemeColorSchemeKey } from '@sanity/ui'
import { memo, useEffect } from 'react'
import { useColorScheme } from 'sanity'

interface Props {
  forceScheme: ThemeColorSchemeKey
}
const SyncColorScheme = ({ forceScheme }: Props) => {
  const { scheme, setScheme } = useColorScheme()

  useEffect(() => {
    if (scheme !== forceScheme) {
      console.log('Force syncing scheme')
      setScheme(forceScheme)
    }
  }, [scheme, forceScheme, setScheme])

  return null
}

export default memo(SyncColorScheme)
