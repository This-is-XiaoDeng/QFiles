const { createClient } = require("oicq");
const express = require("express");
const format = require("string-format");

// Config
const uin = 3457603681;
const password = "2538536XD";
const port = 8080;
const client = createClient(uin);
const app = express();


// Server
app.get("/files/*", async (req, res) => {
  client.logger.info(format("GET {}", req.url));
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
