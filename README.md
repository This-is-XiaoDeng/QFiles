# QFiles

## 简介

QFiles 能让阅览者在不加入 QQ 群的情况下通过浏览器放哪个问到 QQ 群的群文件，并直接在页面上下载文件

## 构建步骤

1. 安装`node.js`
2. 克隆仓库：`git clone https://github.com/This-is-XiaoDeng/QFiles.git`
3. 安装依赖：`npm install`
4. 修改程序配置
5. 运行程序

### 程序配置

程序配置位于文件`index.js`的第103~108（不同版本可能有所差异）行

```javascript
 const uin = 123456;
 const password = "";
 const port = 8080;
 const client = createClient(uin);
 const app = express();
 const group = 701257458;
```

您只需要修改以下几个常量的值

| 常量名     | 类型        | 备注               |
|-----------|------------|-------------------|
| `uin`   	| `number`   | 机器人QQ号          |
| `password`| `String`   | 机器人QQ密码        |
| `port`    | `number`   | HTTP服务器端口      |
| `group`   | `number`   | 群聊，访问者访问服务器后将访问到该群的群文件，机器人QQ必须加入这个群 |

> __Tips:__ 目前 QFiles 会默认使用 Android 登录 QQ，所以您可能无法使用手机版 QQ 登录机器人帐号

## TODO

- [ ] 独立配置文件
- [ ] 重写基本模板
- [ ] 自定义登录协议

<a href="https://pay.thisisxd.top/"><img src="https://img.shields.io/badge/Sponsor%20me!-green?logo=wechat&amp;logoColor=white&amp;style=flat" alt="Sponsor me!"></a>
