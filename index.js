const {
  createClient
} = require("oicq");
const express = require("express");
const format = require("string-format");
const fs = require("fs")

// 服务器
class Server {
  constructor(uin, password, port, group) {
    this.uin = uin;
    this.password = password;
    this.port = port;
    this.client = createClient(this.uin);
    this.group = group;
    this.app = express();
  }
  listen() {
    let that = this;
    this.app.get("/*", async (req, res) => {
      this.client.logger.info(format("GET {}", req.url));
      // 获取信息
      let path = req.url;
      let gfs = this.client.acquireGfs(this.group);
      if (req.query.download === undefined) {
        let file_list = {};
        try {
          file_list = await gfs.ls(path, 0);
        } catch {
          res.send("Cannot get files list, please wait and try again!");
          this.client.logger.error("Cannot get files list!");
        }
        // 读取模板
        let file = fs.readFileSync("./web/index.html");
        let html = file.toString();
        // 合成列表
        let table = "<table><tr><td>Name</td><td>Size</td></tr>"
        let size, url, name;
        for (let file of file_list) {
          if (file["is_dir"]) {
            size = "";
            url = format("{}", file["fid"]);
          } else {
            size = file["size"];
            url = format("?download={}", file["fid"]);
          }
          name = file["name"]
          // 添加文件
          table = table + `<tr><td><a href="${url}">${name}</a></td><td>${size}</td></tr>`;
        }
        table = table + "</table>";
        html = html.replace("{path}", path).replace("{group}", String(this.group)).replace("{file_list}", table);
        res.send(html);
      } else {
        let fid = req.query.download;
        let url = "javascript:alert(\"Cannot get download link!\")";
        let file_status = {};
        try {
          file_status = await gfs.stat(fid);
          url = (await gfs.download(fid)).url;
        } catch {
          this.client.logger.error(`Cannot get status for ${fid}!`);
        }
        // 读取模板
        let file = fs.readFileSync("./web/download.html");
        let html = file.toString();
        // 替换模板
        html = html
          .replace("{file_name}", file_status["name"])
          .replace("{uploader}", String(file_status["user_id"]))
          .replace("{size}", String(file_status["size"]))
          .replace("{create_time}", String(file_status["create_time"]))
          .replace("{download_time}", String(file_status["download_times"]))
          .replace("{url}", url)
          .replace("{back_url}", url.slice(0, url.lastIndexOf("?")));
        res.send(html);
      }
    });

    // 上线
    this.client.on("system.online", () => {
      that.client.logger.info("Logged in!");
      that.app.listen(this.port, function() {
        that.client.logger.info(format("Listening 0.0.0.0:{}", that.port));
      });
    });

    // 登录
    that.client.on("system.login.qrcode",
      (e) => {
        process.stdin.once(
          "data",
          () => {
            that.client.login().then( /*这里是成功后执行的代码*/ ).catch( /*这里是失败后执行的代码*/ );
          }
        );
      }
    ).login(that.password).then( /*这里是成功后执行的代码*/ ).catch( /*这里是失败后执行的代码*/ );
  }
}

if (require.main === module) { // 如果是直接运行
  const uin = 123456;
  const password = "";
  const port = 8080;
  const client = createClient(uin);
  const app = express();
  const group = 701257458;
  new Server(uin, password, port, group).listen();
} else { // 如果是被导入

}
