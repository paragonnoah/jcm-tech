module.exports = {
    resolve: {
      fallback: {
        zlib: require.resolve('browserify-zlib'),
        querystring: require.resolve('querystring-es3'),
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        https: require.resolve('https-browserify'),
        url: require.resolve('url/'),
        os: require.resolve('os-browserify/browser'),
        http: require.resolve('stream-http'),
        assert: require.resolve('assert/'),
        fs: false, // Disable fs (not needed in browser)
        net: false,
        tls: false,
      },
    },
  };