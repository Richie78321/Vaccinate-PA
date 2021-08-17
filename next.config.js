module.exports = {
  async redirects() {
    return [
      {
        source: "/counties/:all",
        destination: "/",
        permanent: true,
      },
      {
        source: "/zips/:all",
        destination: "/",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/",
        permanent: true,
      },
      {
        source: "/additional-resources",
        destination: "/",
        permanent: true,
      },
    ];
  },
};
