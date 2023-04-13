const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      customFileProtocol: "./",
      productName: "Warhol App",
      appId: "sk.sng.warhol",
      mac: {
        // icon: "src/assets/icons/mac/icon.icns",
      },
      win: {
        // icon: "src/assets/icons/win/icon.ico",
        target: [
          {
            target: "portable",
            arch: ["x64"],
          },
        ],
      },
    },
  },
})
