const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
//expressjs
const express = require('express');
//cheerio
const cheerio = require('cheerio');
//puppeteer
//const puppeteer = require('puppeteer');

(async () => {
    const response = await fetch('https://www.blacklistseller.com/report/report_preview/146052');
    const body = await response.text();
    console.log(body);
})();