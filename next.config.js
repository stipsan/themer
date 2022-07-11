// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    urlImports: ['https://cv.creativecody.dev/'],
    browsersListForSwc: true,
    legacyBrowsers: false,
  },
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['cdn.sanity.io', 'source.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  typescript: {
    // @TODO: Remove this and fix the errors
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
