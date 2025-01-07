
const http = require("http");
const fs = require("fs");
const request = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");
const cssFile = fs.readFileSync("style.css", "utf-8");
require('dotenv').config()
const apiKey = process.env.API_KEY;

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempVal%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempMin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempMax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);

  return temperature;
};
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    request(
      `https://api.openweathermap.org/data/2.5/weather?q=pune&appid=${apiKey}`
    )
      .on("data", (chunk) => {
        const parsed = JSON.parse(chunk);
        const realTimeData = replaceVal(homeFile,parsed)
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(realTimeData);
        res.end()
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to error", err);
        res.end();
      });
  } else if(req.url === "/style.css") {
    res.writeHead(200, { "Content-Type": "text/css" });
    res.write(cssFile);
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("404 Not Found");
    res.end();
  }
});

server.listen(8002, () => console.log("server started!!"));
