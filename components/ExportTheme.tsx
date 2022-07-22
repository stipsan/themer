import { InfoOutlineIcon } from '@sanity/icons'
import { Badge, Box, Dialog, Grid, Stack, Text } from '@sanity/ui'
import CodeSnippet from 'components/CodeSnippet'
import CopySnippetButton from 'components/CopySnippetButton'
import {
  FilesViewer,
  QuizButton,
  QuizRow,
  TransitionMinHeight,
} from 'components/ExportTheme.styles'
import { Button, Label } from 'components/Sidebar.styles'
import JSON5 from 'json5'
import { type Dispatch, memo, useMemo, useReducer } from 'react'
import styled from 'styled-components'
import { shortenPresetSearchParams } from 'utils/shortenPresetSearchParams'
import { snippet } from 'utils/snippets'

// Support for URL Imports in TS isn't quite there yet
// Setting up a themer.d.ts is a decent workaround for now
// https://github.com/microsoft/TypeScript/issues/35749
type QuizBuild = 'sanity build' | 'next build' | 'other'
type QuizLoad = 'build-time' | 'runtime'
type QuizTypeScript = boolean
type QuizAction =
  | { type: 'build'; payload: QuizBuild }
  | { type: 'load'; payload: QuizLoad }
  | { type: 'typescript'; payload: QuizTypeScript }

export type QuizDispatch = Dispatch<QuizAction>

export interface QuizState {
  build?: QuizBuild
  load?: QuizLoad
  typescript?: QuizTypeScript
}

const initialQuizState: QuizState = {
  build: null,
  load: null,
  typescript: null,
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'build':
      return { ...state, build: action.payload }
    case 'load':
      return { ...state, load: action.payload }
    case 'typescript':
      return { ...state, typescript: action.payload }
    default:
      return state
  }
}

interface Props {
  searchParams: URLSearchParams
  open: 'export' | 'export-dialog'
  onOpen: () => void
  onClose: () => void
}
const ExportTheme = ({ searchParams, open, onClose, onOpen }: Props) => {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)
  const showTS = useMemo(() => {
    if (state.build === 'sanity build') {
      return true
    }

    if (state.build === 'next build' && state.load) {
      return true
    }

    if (state.build === 'other') {
      return true
    }

    return state.typescript !== null
  }, [state])

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
  const esmUrlDTS = useMemo(() => {
    const url = new URL(esmUrl)
    return `${url.origin}${url.pathname}?*`
  }, [esmUrl])
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
              code={snippet('import-dynamic-js')(JSON5.stringify(esmUrl))}
            />
            <CopySnippetButton
              text="Copy TS"
              toastTitle="Copied TS snippet to the clipboard"
              code={snippet('import-dynamic-ts')(JSON5.stringify(esmUrl))}
            />
          </Grid>
        </Stack>
      </Stack>
      {open === 'export-dialog' && (
        <Dialog
          key="export"
          header="Theme Export Wizard 🧙"
          id="dialog-download-preset"
          onClose={onClose}
          zOffset={1000}
          width={2}
        >
          <Box padding={4}>
            <QuizRow key="state.build" text="How do you build your studio?">
              <QuizButton
                text="sanity build"
                onClick={() =>
                  dispatch({ type: 'build', payload: 'sanity build' })
                }
                selected={state.build === 'sanity build'}
              />
              <QuizButton
                text="next build"
                onClick={() =>
                  dispatch({ type: 'build', payload: 'next build' })
                }
                selected={state.build === 'next build'}
              />
              <QuizButton
                text="custom"
                onClick={() => dispatch({ type: 'build', payload: 'other' })}
                selected={state.build === 'other'}
              />
            </QuizRow>
            <TransitionMinHeight key="state.typescript">
              {state.build && (
                <QuizRow text="Are you using TypeScript?">
                  <QuizButton
                    text="Yes"
                    mode="bleed"
                    onClick={() =>
                      dispatch({ type: 'typescript', payload: true })
                    }
                    selected={state.typescript === true}
                  />
                  <QuizButton
                    text="No, but I should be"
                    mode="bleed"
                    onClick={() =>
                      dispatch({ type: 'typescript', payload: false })
                    }
                    selected={state.typescript === false}
                  />
                </QuizRow>
              )}
            </TransitionMinHeight>
            <TransitionMinHeight key="state.load">
              {state.typescript !== null && state.build === 'next build' && (
                <QuizRow text="Load the theme at?">
                  <QuizButton
                    text="Build time"
                    onClick={() =>
                      dispatch({ type: 'load', payload: 'build-time' })
                    }
                    selected={state.load === 'build-time'}
                  />
                  <QuizButton
                    text="Runtime"
                    onClick={() =>
                      dispatch({ type: 'load', payload: 'runtime' })
                    }
                    selected={state.load === 'runtime'}
                  />
                </QuizRow>
              )}
            </TransitionMinHeight>
            <TransitionMinHeight key="getting started">
              {state.build === 'sanity build' && state.typescript !== null && (
                <Stack space={4}>
                  <FilesViewer
                    key="sanity build"
                    lead={
                      <>
                        Before you can add the import snippet to your
                        {state.typescript ? (
                          <>
                            <StyledBadge fontSize={0}>
                              sanity.config.ts
                            </StyledBadge>
                            you&#39;ll need to make a few changes to{' '}
                            <StyledBadge fontSize={0}>
                              sanity.cli.ts
                            </StyledBadge>{' '}
                            and{' '}
                            <StyledBadge fontSize={0}>
                              tsconfig.json
                            </StyledBadge>{' '}
                            . Checkout{' '}
                            <StyledBadge fontSize={0}>themer.d.ts</StyledBadge>{' '}
                            to get full typings on the URL imports💖
                          </>
                        ) : (
                          <>
                            <StyledBadge fontSize={0}>
                              sanity.config.js
                            </StyledBadge>{' '}
                            you&#39;ll need to make a few changes to your{' '}
                            <StyledBadge fontSize={0}>
                              sanity.cli.js
                            </StyledBadge>{' '}
                            config file.
                          </>
                        )}
                      </>
                    }
                    initial="sanity.config"
                    files={
                      state.typescript
                        ? [
                            {
                              id: 'sanity.config',
                              filename: 'sanity.config.ts',
                              contents: snippet('studio-config')(
                                snippet('import-dynamic-js')(
                                  JSON5.stringify(esmUrl)
                                )
                              ),
                            },
                            {
                              id: 'sanity.cli',
                              filename: 'sanity.cli.ts',
                              contents: snippet('sanity.cli.ts')(),
                            },
                            {
                              filename: 'tsconfig.json',
                              contents: snippet('tsconfig')(),
                              language: 'json',
                            },
                            {
                              filename: 'themer.d.ts',
                              contents: snippet('themer.d.ts')(
                                JSON5.stringify(esmUrl)
                              ),
                            },
                          ]
                        : [
                            {
                              id: 'sanity.config',
                              filename: 'sanity.config.js',
                              contents: snippet('studio-config')(
                                snippet('import-dynamic-js')(
                                  JSON5.stringify(esmUrl)
                                )
                              ),
                            },
                            {
                              id: 'sanity.cli',
                              filename: 'sanity.cli.js',
                              contents: snippet('sanity.cli.js')(),
                            },
                          ]
                    }
                  />
                  <FilesViewer
                    key="sanity build createTheme"
                    lead={
                      <>
                        If you&#39;re quickly iterating on your theme in the
                        comfort of your own Studio it&#39;s annoying to keep
                        changing the import URL to change your theme. You can
                        use the createTheme utility instead:
                      </>
                    }
                    files={[
                      {
                        id: 'studio-config',
                        filename: state.typescript
                          ? 'sanity.config.ts'
                          : 'sanity.config.js',
                        contents: snippet('studio-config-create-theme')(
                          snippet('import-create-theme-dynamic')(
                            JSON5.stringify(esmUrl)
                          )
                        ),
                      },
                    ]}
                  />
                  <FilesViewer
                    key="sanity build _document"
                    lead={
                      <>
                        You can make the studio load faster by adding a
                        modulepreload tag for the theme.
                      </>
                    }
                    files={[
                      {
                        id: '_document',
                        filename: state.typescript
                          ? '_document.tsx'
                          : '_document.js',
                        contents: state.typescript
                          ? snippet('_document.tsx')(JSON5.stringify(esmUrl))
                          : snippet('_document.js')(JSON5.stringify(esmUrl)),
                      },
                    ]}
                  />
                </Stack>
              )}
            </TransitionMinHeight>
            {showTS && state.typescript !== null && false && (
              <>
                {state.build === 'sanity build' && (
                  <>
                    <Box paddingTop={4}>
                      <Text size={1}>
                        Before you can add the import snippet to To get started
                        you&#39;ll need to modify your{' '}
                        {state.typescript ? (
                          <>
                            <StyledBadge fontSize={0}>
                              sanity.config.{state.typescript ? 'ts' : 'js'}
                            </StyledBadge>
                            ,{' '}
                            <StyledBadge fontSize={0}>
                              sanity.config.{state.typescript ? 'ts' : 'js'}
                            </StyledBadge>{' '}
                            <StyledBadge fontSize={0}>
                              tsconfig.json
                            </StyledBadge>{' '}
                            and create a{' '}
                            <StyledBadge fontSize={0}>themer.d.ts</StyledBadge>
                          </>
                        ) : (
                          <>
                            <StyledBadge fontSize={0}>
                              sanity.config.{state.typescript ? 'ts' : 'js'}
                            </StyledBadge>{' '}
                            and{' '}
                            <StyledBadge fontSize={0}>
                              sanity.config.{state.typescript ? 'ts' : 'js'}
                            </StyledBadge>
                          </>
                        )}
                      </Text>
                    </Box>
                    <Stack space={2}>
                      <Box>
                        <StyledBadge>
                          sanity.config.{state.typescript ? 'ts' : 'js'}
                        </StyledBadge>
                      </Box>
                      <CodeSnippet>
                        {snippet('studio-config')(
                          snippet('import-dynamic-js')(JSON5.stringify(esmUrl))
                        )}
                      </CodeSnippet>
                    </Stack>
                    <Stack space={2}>
                      <Box>
                        <StyledBadge>
                          sanity.cli.{state.typescript ? 'ts' : 'js'}
                        </StyledBadge>
                      </Box>
                      <CodeSnippet>
                        {state.typescript
                          ? snippet('sanity.cli.ts')()
                          : snippet('sanity.cli.js')()}
                      </CodeSnippet>
                    </Stack>
                    {state.typescript && (
                      <>
                        <Stack space={2}>
                          <Box>
                            <StyledBadge>themer.d.ts</StyledBadge>
                          </Box>
                          <CodeSnippet>
                            {snippet('themer.d.ts')(JSON5.stringify(esmUrlDTS))}
                          </CodeSnippet>
                        </Stack>
                        <Stack space={2}>
                          <Box>
                            <StyledBadge>tsconfig.json</StyledBadge>
                          </Box>
                          <CodeSnippet>{snippet('tsconfig')()}</CodeSnippet>
                        </Stack>
                      </>
                    )}

                    <Stack space={2}>
                      <Text size={1}>
                        If you&#39;re quickly iterating on your theme in the
                        comfort of your own Studio it&#39;s annoying to keep
                        changing the import URL to change your theme. You can
                        use the createTheme utility instead:
                      </Text>
                      <Box>
                        <StyledBadge>
                          sanity.config.{state.typescript ? 'ts' : 'js'}
                        </StyledBadge>
                      </Box>
                      <CodeSnippet>
                        {snippet('studio-config-create-theme')(
                          snippet('import-create-theme-dynamic')(
                            JSON5.stringify(esmUrl)
                          )
                        )}
                      </CodeSnippet>
                    </Stack>
                    <Stack space={2}>
                      <Text size={1}>
                        You can make the studio load faster by adding a
                        modulepreload tag for the theme.
                      </Text>
                      <Box>
                        <StyledBadge>
                          _document.{state.typescript ? 'tsx' : 'js'}
                        </StyledBadge>
                      </Box>
                      <CodeSnippet>
                        {state.typescript
                          ? snippet('_document.tsx')(JSON5.stringify(esmUrl))
                          : snippet('_document.js')(JSON5.stringify(esmUrl))}
                      </CodeSnippet>
                    </Stack>
                  </>
                )}
              </>
            )}
          </Box>
        </Dialog>
      )}
    </>
  )
}

export default memo(ExportTheme)

const StyledBadge = styled(Badge)`
  span {
    text-transform: none;
  }
`
