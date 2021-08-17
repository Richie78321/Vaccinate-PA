module.exports = {
  async redirects() {
    return [
      {
        source: '/counties/:all',
        destination: '/',
        permanent: true,
      },
      {
        source: '/zips/:all',
        destination: '/',
        permanent: true,
      },
    ]
  },
}