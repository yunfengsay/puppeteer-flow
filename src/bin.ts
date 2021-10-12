#!/usr/bin/env node

"use strict";

const { main } = require("./main");
const { ArgumentParser } = require("argparse");
const { version } = require("../package.json");

const parser = new ArgumentParser({
  description: "Argparse example",
  add_help: true,
  // formatter_class: HelpFormatter
});
parser.add_argument("-v", "--version", {
  action: "version",
  version,
});
parser.add_argument("-c", "--config", {
  help: "配置文件",
});
parser.add_argument("-o", "--output", {
  help: "输出到目标文件",
});
parser.add_argument("-j", "--jquery", {
  help: "是否注入jquery到yemain, true| false, defalut false",
});
parser.add_argument("--log", {
  help: "开启log true|false,default false",
});
console.dir(parser.parse_args());
main(parser.parse_args());
