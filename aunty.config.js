module.exports = {
  type: 'preact-app',
  babel: config => {
    if (!config.plugins) {
      config.plugins = [];
    }

    config.plugins.push([
      'babel-plugin-styled-components',
      {
        displayName: process.env.NODE_ENV === 'development'
      }
    ]);

    return config;
  }
}
