import Head from 'components/Head'

export default function Index() {
  // @TODO grab these from the theme
  const darkest = '#0f172a'
  const lightest = '#fff'

  return (
    <>
      <Head lightest={lightest} darkest={darkest} />
      <h1>Hello world!</h1>
      <h2>{process.env.NEXT_PUBLIC_SANITY_DATASET} {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}</h2>
    </>
  )
}
