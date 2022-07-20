export const config = {
  runtime: 'experimental-edge',
}

export default async function handler() {
  try {
    const { hrtime } = await import(/* webpackIgnore: true */ `node:process`)

    return new Response(JSON.stringify(hrtime.bigint()))
  } catch (err) {
    return new Response(`throw new TypeError(${JSON.stringify(err.message)})`)
  }
}
