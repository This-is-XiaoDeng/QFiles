const { createClient } = require("oicq");
const express = require("express");
const format = require("string-format");
const fs = require("fs")

// Config
const uin = 3457603681;
const password = "2538536XD";
const port = 8080;
const client = createClient(uin);
const app = express();
const group = 701257458;


// Server
app.get("/*", async (req, res) => {
  client.logger.info(format("GET {}", req.url));
  // 获取信息
  let path = req.url;
  let gfs = client.acquireGfs(group);
  if (req.query.download == undefined) {
    let file_list = await gfs.ls(path, 0);
    // 读取模板
    let file = fs.readFileSync("./web/index.html");
    let html = file.toString();
    // 合成列表
    let table = "<table><tr><td>Name</td><td>Size</td></tr>"
    // console.log(file_list);
    let size, url;
    for (var i = 0;i < file_list.length;i++) {
      // console.log(file_list[i]);
      if (file_list[i]["is_dir"]) {
        size = "";
        url = format("{}", file_list[i]["fid"]);
      } else {
        size = file_list[i]["size"];
        url = format("?download={}", file_list[i]["fid"]);
      }
      // 添加文件
      table = table + "<tr><td><a href=\"{url}\">{name}</a></td><td>{size}</td></tr>"
        .replace("{name}", file_list[i]["name"])
        .replace("{size}", size)
        .replace("{url}", url);
    }
    table = table + "</table>";
    // 返回页面
    html = html.replace("{path}", path).replace("{group}", group).replace("{file_list}", table);
    client.logger.info(html);
    res.send(html);
  } else {
    let fid = req.query.download;
    let url = (await gfs.download(fid)).url;
    let file_status = await gfs.stat(fid)
    // 读取模板
    let file = fs.readFileSync("./web/download.html");
    let html = file.toString();
    // 替换模板
    html = html
      .replace("{file_name}", file_status["name"])
      .replace("{uploader}", file_status["user_id"])
      .replace("{size}", file_status["size"])
      .replace("{create_time}", file_status["create_time"])
      .replace("{download_time}", file_status["download_times"])
      .replace("{url}", url)
      .replace("{back_url}", url.slice(end=url.lastIndexOf("?")));
    res.send(html);
  }
});

// 上线
client.on("system.online", () => {
  client.logger.info("Logged in!");
  app.listen(port, function () {
    client.logger.info(format("Listening 0.0.0.0:{}", port));
  });
});

// 登录
client.on("system.login.qrcode", function (e) {
  process.stdin.once("data", () => {
    this.login();
  });
}).login(password);
