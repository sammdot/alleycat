const { execSync } = require("child_process")
const { writeFileSync } = require("fs")
const { EnvironmentPlugin } = require("webpack")

const { version } = require("./_version.json")
const desktop = !!process.env.ACAT_DESKTOP

const osName =
  { win32: "win", darwin: "mac" }[process.platform] || process.platform
const platform = desktop ? osName : "web"
const versionString = `alleycat-${platform} v${version}`

const devel = process.env.NODE_ENV === "development"
const debug = devel && !!process.env.ACAT_DEBUG

module.exports = {
  webpack: {
    plugins: {
      add: [
        new EnvironmentPlugin({
          ACAT_VERSION: version,
          ACAT_DESKTOP: desktop,
          ACAT_PLATFORM: platform,
          ACAT_DEVEL: devel,
          ACAT_DEBUG: debug,
        }),
        {
          apply(compiler) {
            compiler.hooks.initialize.tap("BuildBannerPlugin", () => {
              console.log("\033[1;94m" + versionString + "\033[m")
            })
          },
        },
      ],
    },
  },
}
