import { useRootTheme } from '@sanity/ui'
import NextHead from 'next/head'
import png from 'public/favicon.png'
import svg from 'public/favicon.svg'
import { memo } from 'react'

const title = 'Themer | Create Sanity Studio v3 themes 🪄'

function Head() {
  const { light, dark } = useRootTheme().theme.color

  // @TODO find a better way to override the page title
  // Page title is overriden by StudioLayout
  /*
  useEffect(() => {
    if (document.title !== title) {
      document.title = title
    }
  })
  // */

  return (
    <NextHead>
      <meta name="viewport" content="width=device-width, viewport-fit=cover" />
      <title>{title}</title>
      <meta
        key="theme-color-light"
        name="theme-color"
        content={light.default.base.bg}
        media="(prefers-color-scheme: light)"
      />
      <meta
        key="theme-color-dark"
        name="theme-color"
        content={dark.default.base.bg}
        media="(prefers-color-scheme: dark)"
      />
      <link rel="icon" type="image/svg" href={svg.src} />
      <link rel="icon" type="image/png" href={png.src} />
    </NextHead>
  )
}

export default memo(Head)
