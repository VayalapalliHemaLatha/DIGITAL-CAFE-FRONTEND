module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
    util: require.resolve('util'),
    assert: require.resolve('assert'),
    url: require.resolve('url'),
    os: require.resolve('os-browserify/browser'),
    vm: require.resolve('vm-browserify'),
  };
  
  config.resolve.extensions = [...config.resolve.extensions, '.js', '.jsx', '.ts', '.tsx'];
  
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false
    }
  });

  return config;
};
