const esbuild = require("esbuild");
const path = require("path");


esbuild.build({
  entryPoints: [path.resolve(__dirname, "src", "entry", "index.js")],
  outfile: "dist/logstyx-js-browser.js",
  platform: "browser",
  format: "iife",
  globalName: "Logstyx",
  bundle: true,
  minify: true,
  sourcemap: false,
  target: ["es2015"]
}).catch(() => process.exit(1));
