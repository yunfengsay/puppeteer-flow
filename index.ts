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

const log = (message: string) => {
  message = message.trim();
  if (message.startsWith("---")) {
    message = message.replace("---", "");
    console.log(`---------- ${message} ----------`);
    return;
  }
  console.log(message);
};
const getConfig = (path = "./config.yml"): IConfig => {
  const file = fs.readFileSync(path, "utf8");
  return YAML.parse(file);
};

const getDataItemFunc = (func: string, args = {}) => {
  return vm.runInNewContext(func, {
    console,
    ...args,
  });
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
    const { authActions, authUrl } = this.config;
    if (authActions) {
      await page.goto(authUrl, { waitUntil: "networkidle0" });
      for (const action of authActions) {
        const [actionName, selector, value] = action
          .split(" ")
          .map((v) => v.trim());
        await this.page[actionName](selector, value);
      }
      return;
    }
    if (authUrl) {
      await page.goto(authUrl);
      await page.waitForTimeout(10000);
    }
  }

  async loadUntil(url: string, until: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.page.waitForSelector(until);
  }

  async gotoNext() {
    const { next } = this.config;
    const _next = next.split(" ").map((v) => v.trim());
    const [actionName, slectorName] = _next;
    await this.page[actionName](slectorName);
  }

  async run(config, resultList = []) {
    const { url, wait, until, next, dataItemFunc } = config;

    // load url and wait until element
    await this.loadUntil(url, wait);
    log("☺");
    // get data item
    const _dataItemFunc = getDataItemFunc(dataItemFunc);
    await this.page.exposeFunction("_dataItemFunc", _dataItemFunc);
    await this.page.evaluate(() => {
      _dataItemFunc({ page: this.page }).then((data) => {
        resultList.push(data);
      });
    });
    // if next is not null, run next, else break

    // get next page url
    await this.gotoNext();

    config.url = this.run(next, resultList);
    log(`start url --> ${config.url}`);
    this.run(config, resultList);
  }
  async runAll() {
    const resultList = [];
    this.run(this.config, resultList);
    return resultList;
  }
}

const writeToFile = (content: any, path = "./result.json") => {
  if (typeof content === "object") {
    content = JSON.stringify(content, null, 2);
  }
  fs.writeFileSync(path, content, "utf-8");
};

const main = async () => {
  const config = getConfig();
  const result = {};
  for (let key in config) {
    log(`--- start ${key}`);
    const configItem = config[key];
    const instance = new Spider(configItem);
    await instance.init();
    const data = await instance.runAll();
    result[key] = data;
  }
  writeToFile(result);
  log("--- done");
};

main();
