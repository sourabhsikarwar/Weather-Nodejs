const http = require('http');
const fs = require('fs');
const requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp)
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min)
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max)
    temperature = temperature.replace("{%location%}", orgVal.name)
    temperature = temperature.replace("{%country%}", orgVal.sys.country)
    temperature = temperature.replace("{%country%}", orgVal.weather[0].main)
    return temperature;
}

const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Biaora&appid=7443a2d92249df60c0aeed870c409e43")
        .on("data", (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData]
            // console.log((arrData[0].main.temp)-273)
            // console.log(chunk)
            // console.log("start");

            const realTimeData = arrData.map(val => replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
        })
        .on("end", (err) => {
            if(err) return console.log("connection closed due to errors", err);
            res.end();
            // console.log("end");
        });
    }
    else {
        res.end("File not found");
    }
}).listen(process.env.PORT || 8080, "127.0.0.1");