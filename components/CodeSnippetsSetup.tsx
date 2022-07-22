import { InfoOutlineIcon } from '@sanity/icons'
import { Badge, Box, Dialog, Grid, Stack, Text } from '@sanity/ui'
import CopySnippetButton from 'components/CopySnippetButton'
import type { QuizDispatch, QuizState } from 'components/ExportTheme'
import {
  FilenameBadge,
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

interface Props {
  state: QuizState
  esmUrl: string
  esmUrlDTS: string
}
const CodeSnippetsSetup = ({ state, esmUrl, esmUrlDTS }: Props) => {
  const lead = useMemo(() => {
    if (state.build === 'sanity build') {
      return (
        <>
          Before you can add the import snippet to your
          {state.typescript ? (
            <>
              <FilenameBadge>sanity.config.ts</FilenameBadge>
              you&#39;ll need to make a few changes to{' '}
              <FilenameBadge>sanity.cli.ts</FilenameBadge> and{' '}
              <FilenameBadge>tsconfig.json</FilenameBadge> .
            </>
          ) : (
            <>
              <FilenameBadge>sanity.config.js</FilenameBadge> you&#39;ll need to
              make a change to <FilenameBadge>sanity.cli.js</FilenameBadge>.
            </>
          )}
        </>
      )
    }
    return null
  }, [state.build, state.typescript])

  const initial = useMemo(() => {
    if (state.build === 'sanity build') {
      return 'sanity.config'
    }

    return undefined
  }, [state.build])

  const files = useMemo(() => {
    if (state.build === 'sanity build') {
      return state.typescript
        ? [
            {
              id: 'sanity.config',
              filename: 'sanity.config.ts',
              contents: snippet('studio-config')(
                snippet('import-dynamic-js')(JSON5.stringify(esmUrl))
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
              language: 'json' as const,
            },
            {
              filename: 'themer.d.ts',
              contents: snippet('themer.d.ts')(JSON5.stringify(esmUrlDTS)),
            },
          ]
        : [
            {
              id: 'sanity.config',
              filename: 'sanity.config.js',
              contents: snippet('studio-config')(
                snippet('import-dynamic-js')(JSON5.stringify(esmUrl))
              ),
            },
            {
              id: 'sanity.cli',
              filename: 'sanity.cli.js',
              contents: snippet('sanity.cli.js')(),
            },
          ]
    }

    return []
  }, [esmUrl, esmUrlDTS, state.build, state.typescript])

  const shouldRender = useMemo(() => {
    if (state.build === 'sanity build') {
      return state.typescript !== null
    }

    return false
  }, [state.build, state.typescript])

  if (!shouldRender) {
    return null
  }

  return (
    <>
      <FilesViewer lead={lead} initial={initial} files={files} />
    </>
  )
}

export default memo(CodeSnippetsSetup)
