/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: { url: '/dist' },
    public: { url: '/', static: true, resolve: false },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
  ],
  alias: {
    '@components': './src/components',
    '@containers': './src/containers',
    '@libs': './src/libs',
  },
  routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
  optimize: {
    bundle: true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
}
