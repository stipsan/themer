import { Card,Flex, Spinner, studioTheme,Text,ThemeProvider } from '@sanity/ui'
import Themer from 'components/Themer'
import {useRouter} from 'next/router'
import { Suspense, useEffect,useState } from 'react'

const fallback = <ThemeProvider
// scheme="light"
scheme="dark"
theme={studioTheme}
>
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
        </Flex></Card>
</ThemeProvider>

export default function Index() {
  const { isReady, } = useRouter()
  const [themeUrl, setThemeUrl] = useState<string>(null)

  // Wait with loading until we know if there are custom URL parameters and we've detected if the system wants dark moode or not
  useEffect(() => {
    console.log(new URLSearchParams(location.href).get('darkest'))
    // @TODO is it necessary to wait for isReady  when using URLSearchParams?
    if(isReady && !themeUrl) {
      const searchParams = new URLSearchParams()
      const initialParams = new URLSearchParams(location.href)
      
      const paramsAllowlist = ['lightest', 'darkest', 'default', 'primary', 'transparent', 'positive', 'caution', 'critical', 'minified']
      for (const key of paramsAllowlist) {
        console.log(key)
        if(initialParams.has(key)) {
          searchParams.set(key, initialParams.get(key))
        }
      }

      const url = new URL(`/api/hues?${decodeURIComponent(searchParams.toString())}`, location.origin)
      setThemeUrl(url.toString())
    }
  }, [isReady, themeUrl])

  if(!themeUrl) return fallback
  
 return fallback
  return <Suspense fallback={fallback}>
    <Themer themeUrl={themeUrl} />
  </Suspense>
}