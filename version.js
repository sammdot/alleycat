const version = require("child_process")
  .execSync("git describe --tags")
  .toString()
  .trim()
  .replace(/^v/, "")
  .replace(/-(\d+)-g([0-9a-f]+)/, "+$1.$2")

const fs = require("fs")
// Tauri takes the version from "package.json" so provide the minimal required
fs.writeFileSync("_version.json", JSON.stringify({ version }))
