const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  chainWebpack: (config) => {
    config.module.rule("images").set("parser", {
      dataUrlCondition: {
        maxSize: 50 * 1024, // 50KiB
      },
    })
  },
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
