import { DownloadIcon, InfoOutlineIcon } from '@sanity/icons'
import {
  Box,
  Button as UiButton,
  Dialog,
  Grid,
  Stack,
  Text,
  useToast,
} from '@sanity/ui'
import CodeSnippet from 'components/CodeSnippet'
import CopySnippetButton from 'components/CopySnippetButton'
import { Button, Label } from 'components/Sidebar.styles'
import { memo, useMemo } from 'react'
import { shortenPresetSearchParams } from 'utils/shortenPresetSearchParams'
import { snippet } from 'utils/snippets'

// Support for URL Imports in TS isn't quite there yet
// Setting up a themer.d.ts is a decent workaround for now
// https://github.com/microsoft/TypeScript/issues/35749

interface Props {
  searchParams: URLSearchParams
  open: 'export' | 'export-dialog'
  onOpen: () => void
  onClose: () => void
}
const ExportTheme = ({ searchParams, open, onClose, onOpen }: Props) => {
  const { push: pushToast } = useToast()

  const esmUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    shortenPresetSearchParams(params)
    if (params.get('preset') === 'default') {
      params.delete('preset')
    }
    if (process.env.NODE_ENV === 'production') {
      params.set('min', '1')
    }
    const search = decodeURIComponent(params.toString())
    return new URL(
      `/api/hues${search ? `?${search}` : ''}`,
      location.origin
    ).toString()
  }, [searchParams])
  const downloadUrl = useMemo(() => {
    const url = new URL(esmUrl)
    url.searchParams.delete('min')
    return url.toString()
  }, [esmUrl])

  return (
    <>
      <Stack space={3}>
        <Stack space={2}>
          <Label>First time exporting? 🤷</Label>
          <Button
            tone="primary"
            icon={InfoOutlineIcon}
            text="Read the guide"
            onClick={() => onOpen()}
          />
        </Stack>
        <Stack space={2}>
          <Label>Paste this into your sanity.config.ts 🧑‍💻</Label>
          <Grid columns={2} gap={2}>
            <CopySnippetButton
              text="Copy JS"
              toastTitle="Copied JS snippet to the clipboard"
              // code={`const {theme} = await import(${JSON.stringify(esmUrl)})`}
              code={snippet('import-dynamic-js')(JSON.stringify(esmUrl))}
            />
            <CopySnippetButton
              text="Copy TS"
              toastTitle="Copied TS snippet to the clipboard"
              code={snippet('import-dynamic-ts')(JSON.stringify(esmUrl))}
            />
          </Grid>
        </Stack>
      </Stack>
      {open === 'export-dialog' && (
        <Dialog
          key="export"
          header="Export your theme"
          id="dialog-download-preset"
          onClose={onClose}
          zOffset={1000}
          width={2}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text>
                The easiest way to add your new Studio Theme to your studios is
                by using URL ESM Imports.
              </Text>
              <Text>
                Luckily Sanity v3 uses Vite, thus you can just add this snippet
                below, in your sanity.config.ts file, and add `theme` to one of
                your workspaces.
              </Text>
              <CodeSnippet>
                {snippet('studio-config')(
                  snippet('import-static')(JSON.stringify(esmUrl))
                )}
              </CodeSnippet>
              <Text>
                If you want to quickly iterate on your theme from the comfort of
                your Studio you don&quote;t have to constantly edit import URLs.
                You can import `createTheme` and the `hues` input that were used
                to create the `theme` export:
              </Text>

              <CodeSnippet>
                {snippet('studio-config-create-theme')(
                  snippet('import-create-theme-dynamic')(JSON.stringify(esmUrl))
                )}
              </CodeSnippet>
              <Text>
                This also works in a Webpack bundled app, if you add a magic
                comment to the import:
              </Text>

              <CodeSnippet>
                {`// In create-react-app or similar
const {theme} = await import(/* webpackIgnore: true */${JSON.stringify(esmUrl)})
`}
              </CodeSnippet>
              <Text>
                Please note that this only works if your Webpack application is
                outputting ESM code that are loaded using{' '}
                {`<script type="module">`} tags as browsers only supports
                import() in that mode.
              </Text>
              <Text>
                Lastly, if you are using Next.js you can import these URLs with
                the same ease as node_modules by turning URL Imports in
                next.config.js:
              </Text>

              <CodeSnippet>
                {`// next.config.js
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {experimental: {urlImports: ['https://themer.creativecody.dev/'],},}

module.exports = nextConfig

// Anywhere in your next application:
import {theme} from ${JSON.stringify(esmUrl)}
// Yay, no need for top-level async await or other complicated things, it's as if you npm-installed it :D

// If you want to do fancy things like running this as native ESM in the browser, at runtime, no prefetching or local caching of the theme, like below:
const {createTheme, hues} = await import(/* webpackIgnore: true */${JSON.stringify(
                  esmUrl
                )})
// Then you'll, in addition to that webpackIgnore comment, will need to add these to your next.config
module.exports = {
  experimental: {urlImports: ['https://themer.creativecody.dev/'],browsersListForSwc: true,legacyBrowsers: false,},
}
// Fun fact, that's how this Next App is loading the theme for the Sanity Studio you're looking at right now while reading this 🤯
`}
              </CodeSnippet>
              <Text>
                If URL ESM is not a viable option for you, copy paste the
                contents of this URL, it is self-contained and you can use the
                same imports as previously demonstrated:
              </Text>
              <UiButton
                icon={DownloadIcon}
                as="a"
                href={downloadUrl}
                download="theme.js"
                text="Download theme.js"
              />

              <CodeSnippet>
                {`// ./theme.js
// copy-paste of this URL: ${JSON.stringify(esmUrl)}

// sanity.config.ts
import {theme} from './theme'

// Easy usage as before, and you can still access
import {hues, createTheme} from './theme'
// Allowing you to tweak your theme as you wish
// Without having to run back-and-forth between your studio and this app ;)

export default createConfig({
  theme,
  // or
  theme: createTheme({...hues, ...overrides}),
  plugins: [deskTool()],
  projectId: "b5vzhxkv",
  dataset: "production",
  schema: {
    types: [
      {type: "document", name: "post",title: "Post",
        fields: [
          {
            type: "string",
            name: "title",
            title: "Title",
          },
        ],
      },
    ],
  },
})
`}
              </CodeSnippet>
            </Stack>
          </Box>
        </Dialog>
      )}
    </>
  )
}

export default memo(ExportTheme)
