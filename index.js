#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import chalk from "chalk";

const __dirname = import.meta.dirname;
const cwd = process.cwd();
const jsdir = path.resolve(__dirname, "template-js");
const tsdir = path.resolve(__dirname, "template-ts");

let name = "create-h5-project";
const useTs = [
  process.argv[2]?.toLowerCase(),
  process.argv[3]?.toLowerCase(),
].includes("--usets");

if (useTs) {
  if (process.argv[2]?.toLowerCase() === "--usets") {
    name = process.argv[3] ?? name;
  } else if (process.argv[3]?.toLowerCase() === "--usets") {
    name = process.argv[2];
  }
} else {
  name = process.argv[2] ?? name;
}

const root = path.resolve(cwd, name);

function filter(useTs) {
  return (src, dest) => {
    const exclude = [
      path.resolve(useTs ? tsdir : jsdir, "node_modules"),
      path.resolve(useTs ? tsdir : jsdir, "package-lock.json"),
    ];
    const result = !exclude.includes(src);
    if (result) {
      console.log(`已创建：${dest}`);
    }

    return result;
  };
}

(async () => {
  try {
    await fs.stat(root);
    console.log(`错误：文件或目录已存在`);
    return;
  } catch (error) {}

  if (useTs) {
    await fs.cp(tsdir, root, {
      force: true,
      recursive: true,
      filter: filter(true),
    });
  } else {
    await fs.cp(jsdir, root, {
      force: true,
      recursive: true,
      filter: filter(false),
    });
  }

  // 更新 package.json
  const configFile = path.resolve(root, "package.json");
  const configData = await fs.readFile(configFile);
  const config = JSON.parse(configData);
  config.name = name;
  const newConfigData = JSON.stringify(config, null, 2);
  await fs.rm(configFile, { force: true });
  await fs.writeFile(configFile, newConfigData, { encoding: "utf8" });

  const install = chalk.green(`cd ${name} && npm install`);
  const dev = chalk.green(`npm run dev`);
  console.log("\n");
  console.log(`已完成：`);
  console.log(`1、安装：${install}`);
  console.log(`2、开发：${dev}`);
  console.log("\n");
})();
