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


// Server
app.get("/files/:group_id/:path", async (req, res) => {
  client.logger.info(format("GET {}", req.url));
  // 获取信息
  if (req.params.path == undefined) {
    let path = "/";
  } else {
    let path = req.params.path;
  }
  let group = number(req.params.group_id);
  client.logger.info(format("Getting {}", path));
  let gfs = client.acquireGfs(group);
  let file_list = gfs.ls(path, 0);
  let html = "";
  // Read formwork
  fs.readFile("./web/files.html", function(err,data) {
    if (err) {
      client.logger.warning("Cannot read ./web/files.html!");
      res.statusCode = 500;
      res.send("Server internal error, please check the log");
    } else {
      html = data.toString();
    }
  });
  // Table
  let table = "<table><tr><td>Name</td><td>Size</td><td>Uploader</td><td>Download</td></tr>"
  for (let i = 0;i <= file_list.length;i++) {
    table = table + "<tr><td>{name}</td><td>{size}</td><td>{uploader}</td><td><a href=\"{url}\">Download</a></td></tr>"
      .replace("{name}", file_list[i]["name"])
      .replace("{size}", file_list[i]["size"])
      .replace("{uploader}", file_list[i]["user_id"])
      .replace("url",
        format(
          "/download/{group}/{}".replace("{group}", group),
          file_list[i]["fid"]
        )
      );
  }
  table = table + "</table>"
  res.send(html.replace("{path}", path).replace("{group}", group).replace("{file_list}", table));
});

// Online
client.on("system.online", () => {
  client.logger.info("Logged in!");
  let server = app.listen(port, function () {
    client.logger.info(format("Listening 0.0.0.0:{}", port));
  });
});

// Login
client.on("system.login.qrcode", function (e) {
  process.stdin.once("data", () => {
    this.login();
  });
}).login(password);
