## Quick Start
```bash
$ npm i pcrawl -g
$ pcrawl -c ./config.yml -o ./result.json
```
## args
```js
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
```


## config.yml
| name         | instructions                                                 |
| ------------ | ------------------------------------------------------------ |
| url          | 要爬取的页面地址                                             |
| wait         | 爬取的dom标识，一旦这个类或者id出现则开始爬取                |
| until        | 结束标识，一旦出现这个类或id则停止                           |
| next         | 爬取下一页的行为 如 "click xxx" xxx是个class或id             |
| dataItemFunc | 脚本路径，每次页面wait标识激活后则执行当前方法               |
| authUrl      | 认证地址，如果需要登录可以填写登录地址,加载后会等待10给你输入密码时间 |
| authActions  | 如果需要自动化处理登录认证也可在这里配置一系列action，puppeteer |

## dataItemFunc
1. 必须定义一个 $main函数
2. 必须返回一个数组

## demo
```bash
$ pcrawl -c ./config.yml -o ./result.json
```
config.yml
```yml
instpaaper:
  url: https://www.instapaper.com/u
  wait: .paginate_older
  until: not .paginate_older
  next: click .paginate_older
  dataItemFunc: ./dataItemFunc.js
  authUrl: https://www.instapaper.com/user/login
  authActions:
    - "type #username fdoctor00@gmail.com"
    - "type #password yunfeng0409"
    - "click #log_in"

```
script.js
```js
function $main(args) {
    try {
        const itemList = $('.article_item').toArray();
        const data = itemList.map(v => {
            const find = (className) => {
                return $($(v).find(className)[0])
            };
            const title = find('.article_title').text();
            const desc = find('.article_preview').text();
            const originUrl = find('.js_domain_linkout').get(0).href;
            const result = {
                title,
                desc,
                originUrl,
            }
            return result;
        })
        return data
    } catch (e) {
        console.log(e)
        return []
    }
}
```