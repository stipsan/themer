import type { ImagePalette } from 'sanity'
import { suspend } from 'suspend-react'

export type PaletteApi = `/api/palette/${string}/${string}/${string}`
export type PaletteApiOnEdge =
  `/api/palette-on-edge/${string}/${string}/${string}`
export type PaletteApiResponse = ImagePalette | null
export type Endpoint = PaletteApi | PaletteApiOnEdge

export function useFetcher(endpoint: PaletteApi): PaletteApiResponse
export function useFetcher(endpoint: PaletteApiOnEdge): PaletteApiResponse
export function useFetcher(endpoint) {
  return suspend(async () => {
    const url = new URL(endpoint, location.origin)
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`)
    }
    return res.json()
  }, ['themer', endpoint])
}
