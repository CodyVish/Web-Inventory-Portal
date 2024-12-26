const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  devServer: {
    port: 8000,
  },
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        path: require.resolve("path-browserify"),
        tls: false,
        tty: require.resolve("tty-browserify"),
        url: require.resolve("url/"),
        util: require.resolve("util/"),
        zlib: require.resolve("browserify-zlib"),
        fs: false,
        child_process: false,
        net: false,
        assert: require.resolve("assert/"),
      },
    },
  },
});
