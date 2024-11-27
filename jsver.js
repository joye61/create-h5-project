import { $ } from "execa";
import path from "path";
import readdirp from "readdirp";
import fs from "fs/promises";

const __dirname = import.meta.dirname;
const jsroot = path.resolve(__dirname, "template-js");
const tsroot = path.resolve(__dirname, "template-ts");
const jssrc = path.resolve(jsroot, "src");
const tssrc = path.resolve(tsroot, "src");

(async () => {
  const option = {
    lines: true,
    stdout: ["pipe", "inherit"],
  };

  // 首先删除旧输出目录
  await fs.rm(jssrc, { force: true, recursive: true });
  console.log(`已删除：${jssrc}`);

  // 编译ts到js
  await $({ cwd: tsroot, ...option })`npx tsc -p ../tsconfig.json`;

  // 复制css文件到js模板
  const fileFilter = (file) => file.basename.endsWith(".css");
  for await (const entry of readdirp(tssrc, { fileFilter })) {
    const src = path.resolve(tssrc, entry.path);
    const dest = path.resolve(jssrc, entry.path);
    await fs.copyFile(src, dest);
    console.log(`已复制：${dest}`);
  }

  // 修改app.js文件
  const appFile = path.resolve(jsroot, "src/basics/app.jsx");
  let content = await fs.readFile(appFile, { encoding: "utf-8" });
  content = content.replace(/\{ts\,tsx\}/gm, "{js,jsx}");
  content = content.replace(/data\.ts/gm, "data.js");
  content = content.replace(/index\.ts/gm, "index.js");

  await fs.rm(appFile, { force: true });
  await fs.writeFile(appFile, content, { encoding: "utf8" });
  console.log(`已更新：${appFile}`);
  
})();
