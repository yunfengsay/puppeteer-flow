import * as puppeteer from "puppeteer";
import * as fs from "fs";
import * as vm from "vm";

import * as YAML from "yaml";

interface IConfig {
  [key: string]: IConfigItem;
}

interface IConfigItem {
  url: string;
  wait: string;
  until: string;
  next: string;
  dataItemFunc: string;
  authUrl?: string;
  authActions?: any[];
}

const log = (message: any) => {
  if (typeof message !== "string") {
    console.log("Unknow type log ---> ", message);
    return;
  }
  message = message.trim();
  if (message.startsWith("---")) {
    message = message.replace("---", "");
    console.log(`---------- ${message} ----------`);
    return;
  }
  console.log(message);
};

const getConfig = (path = `${__dirname}/../config.yml`): IConfig => {
  const file = fs.readFileSync(path, "utf8");
  return YAML.parse(file);
};

const getFuncString = (func: string) => {
  if (func.startsWith("/") || func.startsWith("./")) {
    func = fs.readFileSync(func, "utf-8");
  }
  return func;
};

class Spider {
  config: IConfigItem = {} as IConfigItem;
  bowser = null;
  page = null;

  constructor(config: IConfigItem) {
    this.config = config;
  }

  async init() {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    this.bowser = browser;
    const page = await browser.newPage();
    this.page = page;
    const { authActions, authUrl, url } = this.config;
    if (authActions) {
      await page.goto(authUrl, { waitUntil: "domcontentloaded" });
      for (const action of authActions) {
        const [actionName, selector, value] = action
          .split(" ")
          .map((v) => v.trim());
        await this.page[actionName](selector, value);
      }
      await page.goto(url, { waitUntil: "domcontentloaded" });
      return;
    }
    if (authUrl) {
      await page.goto(authUrl);
      await page.waitForTimeout(10000);
      await page.goto(url, { waitUntil: "domcontentloaded" });
    }
    await this.listenLog();
  }
  async listenLog() {
    if (String(global.args.log) !== "true") {
      return;
    }
    this.page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    this.page.on("pageerror", ({ message }) => console.log(message));
  }
  async addJquery() {
    if (String(global.args.jquery) !== "true") {
      return;
    }
    await this.page.addScriptTag({
      url: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
    });
  }
  async loadUntil(url: string, until: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.page.waitForSelector(until);
  }

  async gotoNext() {
    const { next } = this.config;
    const _next = next.split(" ").map((v) => v.trim());
    const [actionName, slectorName] = _next;
    try {
      await this.page.waitForSelector(slectorName, { timeout: 1000 });
      await this.page[actionName](slectorName);
      await this.listenLog();
      return true;
    } catch (e) {
      log("--- end");
      return false;
    }
  }
  async getItemData(config: IConfigItem) {
    const resultList = [];
    await this.addJquery();
    const { dataItemFunc } = config;
    await this.page.waitForTimeout(1000);
    await this.page.addScriptTag({ content: getFuncString(dataItemFunc) });
    // await this.page.exposeFunction("_dataItemFunc", _dataItemFunc);
    await this.page.waitForFunction("window.$main");
    const data = await this.page.evaluate(function () {
      // @ts-ignore
      return $main({});
    });
    resultList.push(...(data || []));
    return resultList;
  }

  async run(config: IConfigItem) {
    let resultList = [];
    // if next is not null, run next, else break
    const onePageList = (await this.getItemData(config)) || [];
    // get next page url
    const isOk = await this.gotoNext();
    if (isOk) {
      const list = await this.run(config);
      resultList = [...list, ...onePageList];
    }
    return resultList;
  }
  async runAll() {
    await this.init();
    const resultList = await this.run({ ...this.config, url: null });
    return resultList;
  }
}

const writeToFile = (content: any, path = "./result.json") => {
  if (typeof content === "object") {
    content = JSON.stringify(content, null, 2);
  }
  fs.writeFileSync(path, content, "utf-8");
};

export const main = async (args: IArgs) => {
  global.args = args;
  const config = getConfig(args.config);
  const result = {};
  for (let key in config) {
    log(`--- start ${key}`);
    const configItem = config[key];
    const instance = new Spider(configItem);
    const data = await instance.runAll();
    result[key] = data;
    console.log(result);
  }
  writeToFile(result, args.output);
  log("--- done");
};

interface IArgs {
  config: string;
  log: string;
  output: string;
  jquery: string;
}
