module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /meshWorker\.ts$/,
        use: { loader: 'worker-loader' },
        type: 'javascript/auto',
      });
    }
    return config;
  },
}; 