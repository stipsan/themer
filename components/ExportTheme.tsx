import { DownloadIcon, InfoOutlineIcon } from '@sanity/icons'
import {
  Badge,
  Box,
  Button as UiButton,
  Card,
  Dialog,
  Grid,
  Inline,
  Stack,
  Text,
} from '@sanity/ui'
import CodeSnippet from 'components/CodeSnippet'
import CopySnippetButton from 'components/CopySnippetButton'
import { Button, Label } from 'components/Sidebar.styles'
import { memo, useMemo, useReducer } from 'react'
import styled from 'styled-components'
import { shortenPresetSearchParams } from 'utils/shortenPresetSearchParams'
import { snippet } from 'utils/snippets'

// Support for URL Imports in TS isn't quite there yet
// Setting up a themer.d.ts is a decent workaround for now
// https://github.com/microsoft/TypeScript/issues/35749
type QuizBuild = 'sanity build' | 'next build' | 'other'
type QuizLoad = 'build-time' | 'runtime'
type QuizEsm = 'static' | 'dynamic' | 'help'
type QuizTypeScript = boolean
type QuizAction =
  | { type: 'build'; payload: QuizBuild }
  | { type: 'load'; payload: QuizLoad }
  | { type: 'esm'; payload: QuizEsm }
  | { type: 'typescript'; payload: QuizTypeScript }

interface QuizState {
  build?: QuizBuild
  load?: QuizLoad
  esm?: QuizEsm
  typescript?: QuizTypeScript
}

const initialQuizState: QuizState = {
  build: null,
  load: null,
  esm: null,
  typescript: null,
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'build':
      return { ...state, build: action.payload }
    case 'load':
      return { ...state, load: action.payload }
    case 'esm':
      return { ...state, esm: action.payload }
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
  const quizzed = useMemo(() => {
    if (state.build === 'sanity build') {
      return true
    }

    if (state.build === 'next build' && state.load) {
      return true
    }

    if (state.build === 'other' && state.esm !== null && state.esm !== 'help') {
      return true
    }

    return false
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
          header="Theme Export Wizard 🧙"
          id="dialog-download-preset"
          onClose={onClose}
          zOffset={1000}
          width={2}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Stack space={2}>
                <Text muted size={1}>
                  How do you build your studio?
                </Text>
                <Inline space={1}>
                  <Button
                    text="sanity build"
                    mode="bleed"
                    onClick={() =>
                      dispatch({ type: 'build', payload: 'sanity build' })
                    }
                    selected={state.build === 'sanity build'}
                  />
                  <Button
                    text="next build"
                    mode="bleed"
                    onClick={() =>
                      dispatch({ type: 'build', payload: 'next build' })
                    }
                    selected={state.build === 'next build'}
                  />
                  <Button
                    text="Other"
                    mode="bleed"
                    onClick={() =>
                      dispatch({ type: 'build', payload: 'other' })
                    }
                    selected={state.build === 'other'}
                  />
                </Inline>
              </Stack>
              {state.build === 'next build' && (
                <Stack space={2}>
                  <Text muted size={1}>
                    Load the theme at?
                  </Text>
                  <Inline space={1}>
                    <Button
                      text="Build time"
                      mode="bleed"
                      onClick={() =>
                        dispatch({ type: 'load', payload: 'build-time' })
                      }
                      selected={state.load === 'build-time'}
                    />
                    <Button
                      text="Runtime"
                      mode="bleed"
                      onClick={() =>
                        dispatch({ type: 'load', payload: 'runtime' })
                      }
                      selected={state.load === 'runtime'}
                    />
                  </Inline>
                </Stack>
              )}
              {state.build === 'other' && (
                <Stack space={2}>
                  <Text muted size={1}>
                    Can you use dynamic URL ESM imports?
                  </Text>
                  <Inline space={1}>
                    <Button
                      text="Yes"
                      mode="bleed"
                      onClick={() =>
                        dispatch({ type: 'esm', payload: 'dynamic' })
                      }
                      selected={state.esm === 'dynamic'}
                    />
                    <Button
                      text="No"
                      mode="bleed"
                      onClick={() =>
                        dispatch({ type: 'esm', payload: 'static' })
                      }
                      selected={state.esm === 'static'}
                    />
                    <Button
                      text="What?"
                      mode="bleed"
                      onClick={() => dispatch({ type: 'esm', payload: 'help' })}
                      selected={state.esm === 'help'}
                    />
                  </Inline>
                  {state.esm === 'help' && (
                    <Text size={1}>ESM Help placeholder</Text>
                  )}
                </Stack>
              )}
              {state.build && (state.esm !== 'help' || quizzed) && (
                <Stack space={2}>
                  <Text muted size={1}>
                    Are you using TypeScript?
                  </Text>
                  <Inline space={1}>
                    <Button
                      text="Yes"
                      mode="bleed"
                      onClick={() =>
                        dispatch({ type: 'typescript', payload: true })
                      }
                      selected={state.typescript === true}
                    />
                    <Button
                      text="No, but I know I should be"
                      mode="bleed"
                      onClick={() =>
                        dispatch({ type: 'typescript', payload: false })
                      }
                      selected={state.typescript === false}
                    />
                  </Inline>
                </Stack>
              )}
              {quizzed && state.typescript !== null && (
                <>
                  {state.build === 'sanity build' && (
                    <>
                      <Text size={1}>
                        To get started you&#39;ll need to modify your{' '}
                        {state.typescript ? (
                          <>
                            <StyledBadge fontSize={0}>
                              sanity.config.{state.typescript ? 'ts' : 'js'}
                            </StyledBadge>
                            ,{' '}
                            <StyledBadge fontSize={0}>
                              sanity.config.{state.typescript ? 'ts' : 'js'}
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
                      <Stack space={2}>
                        <Box>
                          <StyledBadge>
                            sanity.config.{state.typescript ? 'ts' : 'js'}
                          </StyledBadge>
                        </Box>
                        <CodeSnippet>
                          {snippet('studio-config')(
                            snippet('import-dynamic-js')(JSON.stringify(esmUrl))
                          )}
                        </CodeSnippet>
                      </Stack>
                      <Stack space={2}>
                        <Box>
                          <StyledBadge>
                            sanity.cli.{state.typescript ? 'ts' : 'js'}
                          </StyledBadge>
                        </Box>
                        <CodeSnippet>{snippet('cli-config')('')}</CodeSnippet>
                      </Stack>
                      {state.typescript && (
                        <>
                          <Stack space={2}>
                            <Box>
                              <StyledBadge>themer.d.ts</StyledBadge>
                            </Box>
                            <CodeSnippet>
                              {snippet('themer.d.ts')(
                                JSON.stringify(esmUrlDTS)
                              )}
                            </CodeSnippet>
                          </Stack>
                        </>
                      )}
                      <Text size={1}>
                        If you&#39;re quickly iterating on your theme in the
                        comfort of your own Studio it&#39;s annoying to keep
                        changing the import URL to change your theme. You can
                        use the createTheme utility instead:
                      </Text>
                      <Stack space={2}>
                        <Box>
                          <StyledBadge>
                            sanity.config.{state.typescript ? 'ts' : 'js'}
                          </StyledBadge>
                        </Box>
                        <CodeSnippet>
                          {snippet('studio-config-create-theme')(
                            snippet('import-create-theme-dynamic')(
                              JSON.stringify(esmUrl)
                            )
                          )}
                        </CodeSnippet>
                      </Stack>
                    </>
                  )}
                </>
              )}
            </Stack>
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
