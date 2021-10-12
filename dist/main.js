"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var puppeteer = require("puppeteer");
var fs = require("fs");
var YAML = require("yaml");
var log = function (message) {
    if (typeof message !== "string") {
        console.log("Unknow type log ---> ", message);
        return;
    }
    message = message.trim();
    if (message.startsWith("---")) {
        message = message.replace("---", "");
        console.log("---------- " + message + " ----------");
        return;
    }
    console.log(message);
};
var getConfig = function (path) {
    if (path === void 0) { path = "./config.yml"; }
    var file = fs.readFileSync(path, "utf8");
    return YAML.parse(file);
};
var getFuncString = function (func) {
    if (func.startsWith("/") || func.startsWith("./")) {
        func = fs.readFileSync(func, "utf-8");
    }
    return func;
};
var Spider = /** @class */ (function () {
    function Spider(config) {
        this.config = {};
        this.bowser = null;
        this.page = null;
        this.config = config;
    }
    Spider.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var browser, page, _a, authActions, authUrl, url, _i, authActions_1, action, _b, actionName, selector, value;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, puppeteer.launch({
                            headless: false,
                            defaultViewport: null,
                        })];
                    case 1:
                        browser = _c.sent();
                        this.bowser = browser;
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _c.sent();
                        this.page = page;
                        _a = this.config, authActions = _a.authActions, authUrl = _a.authUrl, url = _a.url;
                        if (!authActions) return [3 /*break*/, 9];
                        return [4 /*yield*/, page.goto(authUrl, { waitUntil: "domcontentloaded" })];
                    case 3:
                        _c.sent();
                        _i = 0, authActions_1 = authActions;
                        _c.label = 4;
                    case 4:
                        if (!(_i < authActions_1.length)) return [3 /*break*/, 7];
                        action = authActions_1[_i];
                        _b = action
                            .split(" ")
                            .map(function (v) { return v.trim(); }), actionName = _b[0], selector = _b[1], value = _b[2];
                        return [4 /*yield*/, this.page[actionName](selector, value)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [4 /*yield*/, page.goto(url, { waitUntil: "domcontentloaded" })];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                    case 9:
                        if (!authUrl) return [3 /*break*/, 13];
                        return [4 /*yield*/, page.goto(authUrl)];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, page.waitForTimeout(10000)];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, page.goto(url, { waitUntil: "domcontentloaded" })];
                    case 12:
                        _c.sent();
                        _c.label = 13;
                    case 13: return [4 /*yield*/, this.listenLog()];
                    case 14:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Spider.prototype.listenLog = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (String(global.args.log) !== "true") {
                    return [2 /*return*/];
                }
                this.page.on("console", function (msg) { return console.log("PAGE LOG:", msg.text()); });
                this.page.on("pageerror", function (_a) {
                    var message = _a.message;
                    return console.log(message);
                });
                return [2 /*return*/];
            });
        });
    };
    Spider.prototype.addJquery = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (String(global.args.jquery) !== "true") {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.page.addScriptTag({
                                url: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Spider.prototype.loadUntil = function (url, until) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.goto(url, { waitUntil: "domcontentloaded" })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.waitForSelector(until)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Spider.prototype.gotoNext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var next, _next, actionName, slectorName, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next = this.config.next;
                        _next = next.split(" ").map(function (v) { return v.trim(); });
                        actionName = _next[0], slectorName = _next[1];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.page.waitForSelector(slectorName, { timeout: 1000 })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.page[actionName](slectorName)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.listenLog()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 5:
                        e_1 = _a.sent();
                        log("--- end");
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Spider.prototype.getItemData = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var resultList, dataItemFunc, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultList = [];
                        return [4 /*yield*/, this.addJquery()];
                    case 1:
                        _a.sent();
                        dataItemFunc = config.dataItemFunc;
                        return [4 /*yield*/, this.page.waitForTimeout(1000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.page.addScriptTag({ content: getFuncString(dataItemFunc) })];
                    case 3:
                        _a.sent();
                        // await this.page.exposeFunction("_dataItemFunc", _dataItemFunc);
                        return [4 /*yield*/, this.page.waitForFunction("window.$main")];
                    case 4:
                        // await this.page.exposeFunction("_dataItemFunc", _dataItemFunc);
                        _a.sent();
                        return [4 /*yield*/, this.page.evaluate(function () {
                                // @ts-ignore
                                return $main({});
                            })];
                    case 5:
                        data = _a.sent();
                        resultList.push.apply(resultList, (data || []));
                        return [2 /*return*/, resultList];
                }
            });
        });
    };
    Spider.prototype.run = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var resultList, onePageList, isOk, list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultList = [];
                        return [4 /*yield*/, this.getItemData(config)];
                    case 1:
                        onePageList = (_a.sent()) || [];
                        return [4 /*yield*/, this.gotoNext()];
                    case 2:
                        isOk = _a.sent();
                        if (!isOk) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.run(config)];
                    case 3:
                        list = _a.sent();
                        resultList = __spreadArray(__spreadArray([], list, true), onePageList, true);
                        _a.label = 4;
                    case 4: return [2 /*return*/, resultList];
                }
            });
        });
    };
    Spider.prototype.runAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resultList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.run(__assign(__assign({}, this.config), { url: null }))];
                    case 2:
                        resultList = _a.sent();
                        return [2 /*return*/, resultList];
                }
            });
        });
    };
    return Spider;
}());
var writeToFile = function (content, path) {
    if (path === void 0) { path = "./result.json"; }
    if (typeof content === "object") {
        content = JSON.stringify(content, null, 2);
    }
    fs.writeFileSync(path, content, "utf-8");
};
var main = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var config, result, _a, _b, _i, key, configItem, instance, data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                global.args = args;
                config = getConfig(args.config);
                result = {};
                _a = [];
                for (_b in config)
                    _a.push(_b);
                _i = 0;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                key = _a[_i];
                log("--- start " + key);
                configItem = config[key];
                instance = new Spider(configItem);
                return [4 /*yield*/, instance.runAll()];
            case 2:
                data = _c.sent();
                result[key] = data;
                console.log(result);
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                writeToFile(result, args.out);
                log("--- done");
                return [2 /*return*/];
        }
    });
}); };
exports.main = main;
//# sourceMappingURL=main.js.map