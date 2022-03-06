// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@util": path.resolve(__dirname, "src/util"),
      "@redux": path.resolve(__dirname, "src/redux"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@static": path.resolve(__dirname, "src/static"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@localization": path.resolve(__dirname, "src/localization"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@api": path.resolve(__dirname, "src/api"),
    },
    configure: (webpackConfig) => {
      // other stuff with webpackConfig
      return {
        ...webpackConfig,
        ignoreWarnings: [/Failed to parse source map/],
      };
    },
  },
};
