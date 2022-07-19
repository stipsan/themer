// SquareIcon use for single view menu

import { MusicNoteIcon } from '@heroicons/react/outline'
import {
  DownloadIcon,
  DropIcon,
  HeartIcon,
  LaunchIcon,
  LemonIcon,
  MasterDetailIcon,
  PackageIcon,
  SelectIcon,
  UploadIcon,
} from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Code,
  Dialog,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Text,
  TextInput,
} from '@sanity/ui'
import ImportFromImage from 'components/ImportFromImage'
import {
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import styled from 'styled-components'
import { presets } from 'utils/presets'
import type { Hues, ThemePreset } from 'utils/types'

const SynthWaveIcon = styled(MusicNoteIcon)`
  transform: translateX(-1px);
  width: 16px;
  stroke-width: 1.4;
`

const TwLogo = (
  <svg viewBox="0 0 52 31" style={{ width: 16, transform: 'translateY(-3px)' }}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0zM12.758 15.218C5.954 15.218 1.701 18.6 0 25.364c2.552-3.382 5.529-4.65 8.93-3.805 1.942.482 3.33 1.882 4.865 3.432 2.502 2.524 5.397 5.445 11.722 5.445 6.804 0 11.057-3.381 12.758-10.145-2.552 3.382-5.529 4.65-8.931 3.805-1.941-.483-3.329-1.883-4.864-3.432-2.502-2.524-5.398-5.446-11.722-5.446z"
      fill="currentColor"
    />
  </svg>
)

// @TODO React.lazy these icons
const iconFromSlug = (slug: string) => {
  return slug === 'pink-synth'
    ? SynthWaveIcon
    : slug === 'tw-cyan'
    ? TwLogo
    : slug === 'dew'
    ? DropIcon
    : slug === 'rosabel'
    ? HeartIcon
    : slug === 'verdant'
    ? LemonIcon
    : MasterDetailIcon
}

interface Props {
  startTransition: TransitionStartFunction
  setPreset: Dispatch<SetStateAction<ThemePreset>>
  prepareTransition: () => void
  onChange: (preset: ThemePreset) => void
  selected: ThemePreset
  hues: Hues
  unstable_showParsedUrl: boolean
}
export default function PresetsMenu({
  selected,
  onChange,
  hues,
  prepareTransition,
  startTransition,
  setPreset,
  unstable_showParsedUrl,
}: Props) {
  const [open, setOpen] = useState<'import' | 'share' | 'export' | false>(false)
  const [mounted, setMounted] = useState<'import' | 'share' | 'export' | false>(
    false
  )

  useEffect(() => {
    if (open) {
      setMounted(open)
    }
  }, [open])

  const searchParams = useMemo(() => {
    const searchParams = new URLSearchParams()
    searchParams.set('preset', selected.slug)
    // default, primary, transparent, positive, caution, critical
    searchParams.set(
      'default',
      `${hues.default.mid.replace(/^#/, '')};${
        hues.default.midPoint
      };lightest:${hues.default.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.default.darkest.replace(/^#/, '')}`
    )
    searchParams.set(
      'primary',
      `${hues.primary.mid.replace(/^#/, '')};${
        hues.primary.midPoint
      };lightest:${hues.primary.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.primary.darkest.replace(/^#/, '')}`
    )
    searchParams.set(
      'transparent',
      `${hues.transparent.mid.replace(/^#/, '')};${
        hues.transparent.midPoint
      };lightest:${hues.transparent.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.transparent.darkest.replace(/^#/, '')}`
    )
    searchParams.set(
      'positive',
      `${hues.positive.mid.replace(/^#/, '')};${
        hues.positive.midPoint
      };lightest:${hues.positive.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.positive.darkest.replace(/^#/, '')}`
    )
    searchParams.set(
      'caution',
      `${hues.caution.mid.replace(/^#/, '')};${
        hues.caution.midPoint
      };lightest:${hues.caution.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.caution.darkest.replace(/^#/, '')}`
    )
    searchParams.set(
      'critical',
      `${hues.critical.mid.replace(/^#/, '')};${
        hues.critical.midPoint
      };lightest:${hues.critical.lightest.replace(
        /^#/,
        ''
      )};darkest:${hues.critical.darkest.replace(/^#/, '')}`
    )

    return searchParams
  }, [hues, selected.slug])

  const shareLink = useMemo(() => {
    const url = new URL(
      `/?${decodeURIComponent(searchParams.toString())}`,
      location.origin
    )
    if (process.env.NODE_ENV === 'production') {
      url.searchParams.set('min', '1')
    }

    return decodeURIComponent(url.toString())
  }, [searchParams])

  const esmUrl = useMemo(() => {
    const url = new URL(
      `/api/hues?${decodeURIComponent(searchParams.toString())}`,
      location.origin
    )
    if (process.env.NODE_ENV === 'production') {
      url.searchParams.set('min', '1')
    }

    return decodeURIComponent(url.toString())
  }, [searchParams])

  return (
    <Card style={{ paddingLeft: 'env(safe-area-inset-left)' }}>
      <Card paddingX={[4]} paddingBottom={2}>
        <Label htmlFor="presets" size={0} muted>
          Presets
        </Label>
        <Card paddingY={2}>
          <MenuButton
            button={
              <Button
                fontSize={1}
                paddingY={2}
                paddingX={3}
                tone="default"
                mode="ghost"
                icon={selected.icon ?? iconFromSlug(selected.slug)}
                iconRight={SelectIcon}
                text={selected.title}
              />
            }
            id="presets"
            menu={
              <Menu>
                {presets.map((_preset) => {
                  const { slug, icon, title } = _preset
                  const active = selected.slug === slug
                  return (
                    <MenuItem
                      fontSize={1}
                      paddingY={2}
                      paddingX={3}
                      key={slug}
                      icon={icon ?? iconFromSlug(slug)}
                      text={title}
                      tone={active ? 'primary' : 'default'}
                      selected={active}
                      onClick={
                        active ? undefined : () => void onChange(_preset)
                      }
                    />
                  )
                })}
              </Menu>
            }
            placement="bottom-start"
            popover={{ portal: true }}
          />
        </Card>
      </Card>
      <Card paddingX={[4]} paddingBottom={2}>
        <Label size={0} muted>
          Tools
        </Label>
        <Card paddingY={2}>
          <TabList space={2}>
            <Tab
              fontSize={1}
              aria-controls="import-panel"
              icon={UploadIcon}
              id="import-tab"
              label="Import"
              onClick={() =>
                setOpen((open) => (open === 'import' ? false : 'import'))
              }
              selected={open === 'import'}
            />
            <Tab
              fontSize={1}
              aria-controls="share-panel"
              icon={PackageIcon}
              id="share-tab"
              label="Share"
              onClick={() =>
                setOpen((open) => (open === 'share' ? false : 'share'))
              }
              selected={open === 'share'}
            />
            <Tab
              fontSize={1}
              aria-controls="export-panel"
              icon={DownloadIcon}
              id="export-tab"
              label="Export"
              onClick={() =>
                setOpen((open) => (open === 'export' ? false : 'export'))
              }
              selected={open === 'export'}
            />
          </TabList>
        </Card>
        <TabPanel
          aria-labelledby="import-tab"
          hidden={open !== 'import'}
          id="import-panel"
        >
          {mounted === 'import' && (
            <Card marginY={2}>
              <ImportFromImage
                prepareTransition={prepareTransition}
                startTransition={startTransition}
                setPreset={setPreset}
                unstable_showParsedUrl={unstable_showParsedUrl}
              />
            </Card>
          )}
        </TabPanel>
      </Card>
      {open === 'export' && (
        <Dialog
          key="export"
          header="Export your theme"
          id="dialog-download-preset"
          onClose={() => setOpen(false)}
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
              <Card
                marginY={[2, 2, 3]}
                overflow="auto"
                padding={4}
                radius={2}
                shadow={1}
              >
                <Code language={'ts'} muted>
                  {`// sanity.config.ts
import { createConfig } from "sanity";
import { deskTool } from "sanity/desk";

// Add this URL ESM import
import { theme } from ${JSON.stringify(esmUrl)};

export default createConfig({
  theme, // <-- add the theme here
  plugins: [deskTool()],
  projectId: "b5vzhxkv",
  dataset: "production",
  schema: {
    types: [
      {
        type: "document",
        name: "post",
        title: "Post",
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
});`}
                </Code>
              </Card>
              <Text>
                If you want to quickly iterate on your theme from the comfort of
                your Studio you don&quote;t have to constantly edit import URLs.
                You can import `createTheme` and the `hues` input that were used
                to create the `theme` export:
              </Text>
              <Card
                marginY={[2, 2, 3]}
                overflow="auto"
                padding={4}
                radius={2}
                shadow={1}
              >
                <Code language={'ts'} muted>
                  {`// sanity.config.ts
import { createConfig } from "sanity";
import { deskTool } from "sanity/desk";

// Add this URL ESM import
import { createTheme, hues } from ${JSON.stringify(esmUrl)};

export default createConfig({
  theme: createTheme({
    // override just the bits you want to iterate on
    ...hues, primary: { ...hues.primary, mid: '#22fca8' } 
  }),
  plugins: [deskTool()],
  projectId: "b5vzhxkv",
  dataset: "production",
  schema: {
    types: [
      {
        type: "document",
        name: "post",
        title: "Post",
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
});`}
                </Code>
              </Card>
              <Text>
                This also works in a Webpack bundled app, if you add a magic
                comment to the import:
              </Text>
              <Card
                marginY={[2, 2, 3]}
                overflow="auto"
                padding={4}
                radius={2}
                shadow={1}
              >
                <Code language={'ts'} muted>
                  {`// In create-react-app or similar
const {theme} = await import(/* webpackIgnore: true */${JSON.stringify(esmUrl)})
`}
                </Code>
              </Card>
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
              <Card
                marginY={[2, 2, 3]}
                overflow="auto"
                padding={4}
                radius={2}
                shadow={1}
              >
                <Code language={'ts'} muted>
                  {`// next.config.js
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    urlImports: ['https://themer.creativecody.dev/'],
  },
}

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
  experimental: {
    urlImports: ['https://themer.creativecody.dev/'],
    browsersListForSwc: true,
    legacyBrowsers: false,
  },
}
// Fun fact, that's how this Next App is loading the theme for the Sanity Studio you're looking at right now while reading this 🤯
`}
                </Code>
              </Card>
              <Text>
                If URL ESM is not a viable option for you, copy paste the
                contents of this URL, it is self-contained and you can use the
                same imports as previously demonstrated:
              </Text>
              <Button icon={LaunchIcon} as="a" href={esmUrl} text="Open" />
              <Card
                marginY={[2, 2, 3]}
                overflow="auto"
                padding={4}
                radius={2}
                shadow={1}
              >
                <Code language={'ts'} muted>
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
      {
        type: "document",
        name: "post",
        title: "Post",
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
                </Code>
              </Card>
            </Stack>
          </Box>
        </Dialog>
      )}
      {open === 'share' && (
        <Dialog
          key="share"
          header="Share"
          id="dialog-share-preset"
          onClose={() => setOpen(false)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text>
                Share this link to let others try out your Studio v3 theme.
              </Text>
              <TextInput readOnly value={shareLink} />
              <Button icon={LaunchIcon} as="a" href={shareLink} text="Open" />
            </Stack>
          </Box>
        </Dialog>
      )}
    </Card>
  )
}
