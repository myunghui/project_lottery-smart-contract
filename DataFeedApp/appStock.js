"use strict"

const express = require("express");
const app = express();

//console.log("__dirname=" + __dirname);
app.use(express.static(__dirname + "/public"));

app.get("/", function(request, response){
	
	console.log(">>>	처리중");
	const client = require("cheerio-httpcli");
	const word = "";
	const url = "https://finance.naver.com/sise";
	client.fetch(url, { q: word }, function (err, $, res, body) {
		const kospi    = $("#KOSPI_now").text();
		const kosdaq = $("#KOSDAQ_now").text();
		let resContent = {"KOSPI":kospi, "KOSDAQ":kosdaq};
		console.log("대한민국 종합주가지수 조회 결과 : " + (resContent === undefined ? "" : JSON.stringify(resContent)));
		response.json(resContent);
	});
	
});

app.get("/favicon.ico", function(request, res){
	res.end();
});

const PORT_NUM = 3000;
app.listen(PORT_NUM, function(){
	let initLog = "\n";
	initLog += "******************************************";
	initLog += "\n";
	initLog += "\n";
	initLog += "	네이버 크롤링 서비스 개시";
	initLog += "\n";
	initLog += "\n";
	initLog += "	>>>	http://localhost:" + PORT_NUM + "/";
	initLog += "\n";
	initLog += "\n";
	initLog += "******************************************";
	initLog += "\n";
    console.log(initLog);
});

