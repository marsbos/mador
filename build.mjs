import fs from "fs";
import { minify } from "terser";

const code = fs.readFileSync("./src/mador.js", "utf8");

const esmResult = await minify(code, {
  module: true,
  compress: { passes: 5, ecma: 2020, toplevel: true },
  mangle: { toplevel: true, properties: { regex: /^_/ } },
});

fs.mkdirSync("./dist", { recursive: true });
fs.writeFileSync("./dist/mador.js", esmResult.code);

const stats = fs.statSync("./dist/mador.js");
console.log(`⚡ Mador ESM Build: ${stats.size} bytes`);
