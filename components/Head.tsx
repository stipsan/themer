import NextHead from 'next/head'
import png from 'public/favicon.png'
import svg from 'public/favicon.svg'
import { memo, useEffect } from 'react'

const title = 'Themer | Create Sanity Studio v3 themes 🪄'

interface Props {
  lightest: string
  darkest: string
}
function Head({ lightest, darkest }: Props) {
  // @TODO find a better way to override the page title
  useEffect(() => {
    if (document.title !== title) {
      document.title = title
    }
  })

  return (
    <NextHead>
      <meta name="viewport" content="width=device-width, viewport-fit=cover" />
      <title>Themer | Create Sanity Studio v3 themes 🪄</title>
      <meta
        key="theme-color-light"
        name="theme-color"
        content={lightest}
        media="(prefers-color-scheme: light)"
      />
      <meta
        key="theme-color-dark"
        name="theme-color"
        content={darkest}
        media="(prefers-color-scheme: dark)"
      />
      <link rel="icon" type="image/svg" href={svg.src} />
      <link rel="icon" type="image/png" href={png.src} />
    </NextHead>
  )
}

export default memo(Head)
