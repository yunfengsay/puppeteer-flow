#!/usr/bin/env node
"use strict";
var main = require("./main").main;
var ArgumentParser = require("argparse").ArgumentParser;
var version = require("../package.json").version;
var parser = new ArgumentParser({
    description: "Argparse example",
    add_help: true,
    // formatter_class: HelpFormatter
});
parser.add_argument("-v", "--version", {
    action: "version",
    version: version,
});
parser.add_argument("-c", "--config", {
    help: "配置文件",
});
parser.add_argument("-j", "--jquery", {
    help: "是否注入jquery到yemain, true| false, defalut false",
});
parser.add_argument("--log", {
    help: "开启log true|false,default false",
});
console.dir(parser.parse_args());
main(parser.parse_args());
//# sourceMappingURL=bin.js.map