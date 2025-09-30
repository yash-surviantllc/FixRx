export default {
  // Optional: Change the port if 6100 is in use
  // port: 6100,
  // Optional: Configure Vite
  viteConfig: (config) => ({
    ...config,
    // Add any Vite config overrides here
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        // Add any necessary aliases here
      },
    },
  }),
};
