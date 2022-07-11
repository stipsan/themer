import NextHead from 'next/head'
import png from 'public/favicon.png'
import svg from 'public/favicon.svg'
import { memo } from 'react'

interface Props {
  lightest: string
  darkest: string
}
function Head({ lightest, darkest }: Props) {
  return (
    <NextHead>
      <title>Themer | Create Sanity Studio v3 themes 🪄</title>
      <meta name="theme-color" content={lightest} />
      <meta
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
