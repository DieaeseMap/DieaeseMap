const news = require("./js/newsCrawling");
const mail = require("./js/mailConfig");
const express = require("express");
const app = express();

app.set("port", 5500); // 포트 설정
app.set("host", "0.0.0.0"); // 아이피 설정

app.use(express.static("public", { maxAge: "1d" }));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "\\index.html");
});

app.get("/api/news", async function (req, res) {
  const data = await news.getParsing1("감염병");
  res.send(data);
});

app.get("/api/news2", async function (req, res) {
  const data = await news.getParsing2("감염병");
  res.send(data);
});

app.post("/api/sendEmail", function (req, res) {
  console.log(req.body);
  const { fromEmail, subject, message } = req.body;
  const data = mail.mailConfig(fromEmail, subject, message);
  res.send(data);
});

// 서버 동작중인 표시
app.listen(app.get("port"), app.get("host"), () =>
  console.log(
    "Server is running on : " + app.get("host") + ":" + app.get("port")
  )
);
