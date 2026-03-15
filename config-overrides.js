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

  // Define process.env for browser
  config.plugins = [
    ...(config.plugins || []),
    new (require('webpack')).DefinePlugin({
      'process.env': JSON.stringify(process.env),
      'process.browser': JSON.stringify(true),
      'process.version': JSON.stringify(process.version),
      'process.versions': JSON.stringify(process.versions),
    })
  ];
  
  return config;
};
