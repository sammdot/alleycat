const { execSync } = require("child_process")
const { writeFileSync } = require("fs")
const { EnvironmentPlugin } = require("webpack")

const { version } = require("./_version.json")
const desktop = !!process.env.ACAT_DESKTOP

const platform = desktop ? process.platform : "web"
const versionString = `AlleyCAT v${version} (${platform})`

module.exports = {
  webpack: {
    plugins: {
      add: [
        new EnvironmentPlugin({
          ACAT_VERSION: version,
          ACAT_DESKTOP: desktop,
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
