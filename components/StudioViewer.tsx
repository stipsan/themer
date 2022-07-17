import {
  type ThemeColorSchemeKey,
  Grid,
  ThemeProvider,
  useElementRect,
} from '@sanity/ui'
import StudioPreview from 'components/StudioPreview'
import { useMagicRouter } from 'hooks/useMagicRouter'
import {
  type TransitionStartFunction,
  memo,
  useCallback,
  useRef,
  useState,
} from 'react'
import { type WorkspaceOptions } from 'sanity'
import styled from 'styled-components'

type View = 'default' | 'split'

interface Props {
  config: WorkspaceOptions[]
  scheme: ThemeColorSchemeKey
  theme: WorkspaceOptions['theme']
  view: View
}
export const StudioViewer = memo(function StudioViewer({
  config,
  scheme,
  theme,
  view,
}: Props) {
  const history = useMagicRouter('hash')

  const uglyHackRef = useRef(null)
  const uglyHackRect = useElementRect(uglyHackRef.current)

  return (
    // @TODO replace this ThemeProvider scheme hack with just a Card and a Grid
    <ThemeProvider scheme="dark">
      <ViewerGrid
        ref={uglyHackRef}
        height="fill"
        columns={[1, view === 'split' ? 2 : 1]}
        // @TODO fix rows layout
        // rows={[view === 'split' ? 2 : 1, 1]}
        /*
      style={{
        height: view === 'split' ? '200dvh' : '100dvh',
        maxHeight:  view === 'split' ? '200vh' :'100vh',
        overflow: 'auto',
      }}
      // */
        // @TODO fix scroll on mobile split view
        style={{
          height: '100dvh',
          maxHeight: '100vh',
          overflow: 'auto',
          ['--ugly-hack-width' as any]:
            uglyHackRef?.current && uglyHackRect?.width
              ? `${uglyHackRect.width}px`
              : undefined,
          ['--ugly-hack-height' as any]:
            uglyHackRef?.current && uglyHackRect?.height
              ? `${
                  /*view === 'split'
              ? uglyHackRect.height / 2
              : */ uglyHackRect.height
                }px`
              : undefined,
        }}
      >
        <StudioPreview
        // updating the key with the view forces the updated media queries to apply
          key={view}
          config={config}
          scheme={scheme}
          theme={theme}
          unstable_history={history}
        />
        {view === 'split' && (
          <StudioPreview
            key="aside"
            config={config}
            scheme={scheme === 'dark' ? 'light' : 'dark'}
            theme={theme}
            unstable_history={history}
          />
        )}
      </ViewerGrid>
    </ThemeProvider>
  )
})

export const useStudioViewer = ({
  startTransition,
}: {
  startTransition: TransitionStartFunction
}) => {
  const [view, setView] = useState<View>('default')
  const toggleView = useCallback(
    () =>
      startTransition(() =>
        setView((view) => (view === 'default' ? 'split' : 'default'))
      ),
    [startTransition]
  )

  return { view, toggleView }
}

// Trying to impress Snorre with my 1337 CSS haxxor
const ViewerGrid = styled(Grid)`
  position: relative;
  gap: 1px;
  background-color: ${({ theme }) => theme.sanity.color.base.border};

  & [data-ui='ToolScreen'] {
    /* @TODO investigate if it's safe to set overflow: hidden on these */
    overflow: ${({ columns }) => (columns[1] === 1 ? 'visible' : 'hidden')};
  }

  & [data-ui='Navbar'] + div {
    top: calc(100vh - var(--ugly-hack-height, 0));
    top: calc(100dvh - var(--ugly-hack-height, 0));
    left: calc(100vw - var(--ugly-hack-width, 0));
    left: calc(100dvw - var(--ugly-hack-width, 0));
  }
`
