import type { QuizState } from 'components/ExportTheme'
import {
  FilenameBadge,
  FilesViewer,
} from 'components/ExportTheme.styles'
import JSON5 from 'json5'
import { memo, useMemo } from 'react'
import { snippet } from 'utils/snippets'

interface Props {
  state: QuizState
  esmUrl: string
  esmUrlDTS: string
  esmUrlOrigin: string
}
const CodeSnippetsSetup = ({
  state,
  esmUrl,
  esmUrlDTS,
  esmUrlOrigin,
}: Props) => {
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
          <a href="https://github.com/stipsan/example-v3-studio" target="_blank" rel="noreferrer">Example repo</a>
        </>
      )
    }

    if (state.build === 'next build' && state.load === 'build-time') {
      return (
        <>
          Before you can add the import snippet to your
          <FilenameBadge>
            sanity.config.{state.typescript ? 'ts' : 'js'}
          </FilenameBadge>
          you&#39;ll need to make a few changes to{' '}
          <FilenameBadge>next.config.js</FilenameBadge> and{' '}
          <FilenameBadge>
            pages/_document.{state.typescript ? 'tsx' : 'js'}
          </FilenameBadge>{' '}
          .
        </>
      )
    }

    if (state.build === 'next build' && state.load === 'build-time') {
      return (
        <>
        Before you can add the import snippet to your
        <FilenameBadge>
          sanity.config.{state.typescript ? 'ts' : 'js'}
        </FilenameBadge>
        you&#39;ll need to make a few changes to{' '}
        <FilenameBadge>
          next.config.js
        </FilenameBadge>{' '}
        and{' '}
        <FilenameBadge>
          pages/_document.{state.typescript ? 'tsx' : 'js'}
        </FilenameBadge>{' '}
        .
      </>
      )
    }

    if(state.build === 'other') {
      return null
    }
  }, [state.build, state.load, state.typescript])

  const initial = useMemo(() => {
    if (state.build === 'sanity build') {
      return 'sanity.config'
    }

    if (state.build === 'next build' && state.load === 'build-time') {
      return 'sanity.config'
    }

    if (state.build === 'next build' && state.load === 'runtime') {
      return undefined
    }

    if(state.build === 'other') {
      return undefined
    }

  }, [state.build, state.load])

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

    if (state.build === 'next build' && state.load === 'build-time') {
      return state.typescript
        ? [
            {
              id: 'sanity.config',
              filename: 'sanity.config.ts',
              contents: snippet('studio-config-static-import')(
                snippet('import-static')(JSON5.stringify(esmUrl))
              ),
            },
            {
              filename: 'next.config.js',
              contents: snippet('next-config-build-time-ts')(
                JSON5.stringify(esmUrlOrigin)
              ),
            },
            {
              id: 'pages/_document',
              filename: 'pages/_document.tsx',
              contents: snippet('pages/_document.tsx')(),
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
              contents: snippet('studio-config-static-import')(
                snippet('import-static')(JSON5.stringify(esmUrl))
              ),
            },
            {
              filename: 'next.config.js',
              contents: snippet('next-config-build-time-js')(
                JSON5.stringify(esmUrlOrigin)
              ),
            },
            {
              id: 'pages/_document',
              filename: 'pages/_document.js',
              contents: snippet('pages/_document.js')(),
            },
          ]
    }

    if(state.build === 'next build' && state.load === 'runtime') {
return state.typescript
? [
    {
      id: 'sanity.config',
      filename: 'sanity.config.ts',
      contents: snippet(
        'studio-config-next-runtime'
      )(),
    },
    {
      id: 'pages/_document',
      filename: 'pages/_document.tsx',
      contents: snippet('pages/_document.tsx')(),
    },
    {
      filename: 'themer.d.ts',
      contents: snippet('themer.d.ts')(
        JSON5.stringify(esmUrlDTS)
      ),
    },
  ]
: [
    {
      id: 'sanity.config',
      filename: 'sanity.config.js',
      contents: snippet(
        'studio-config-next-runtime'
      )(),
    },
    {
      id: 'pages/_document',
      filename: 'pages/_document.js',
      contents: snippet('pages/_document.js')(),
    },
  ]
    }

    if(state.build === 'other') {
      return []
    }

  }, [
    esmUrl,
    esmUrlDTS,
    esmUrlOrigin,
    state.build,
    state.load,
    state.typescript,
  ])

  const shouldRender = useMemo(() => {
    if (state.build === 'sanity build') {
      return state.typescript !== null
    }

    if (state.build === 'next build' && state.load === 'build-time') {
      return state.typescript !== null
    }

    if(state.build === 'next build' && state.load === 'runtime') {
      return true
    }

    return false
  }, [state.build, state.load, state.typescript])

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
