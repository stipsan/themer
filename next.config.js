// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    urlImports: ['https://themer.creativecody.dev/'],
    browsersListForSwc: true,
    legacyBrowsers: false,
    images: {
      allowFutureImage: true,
    },
    // @TODO figure out why it fails due to not finding a 'critters' module
    // optimizeCss: true,
  },
  compiler: {
    styledComponents: true,
    // removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['cdn.sanity.io', 'source.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Disabling swcMinify until figuring out why the export modal crashes
  // swcMinify: true,
}

module.exports = nextConfig
