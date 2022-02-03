//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
//expressjs
const express = require('express');
//cheerio
const cheerio = require('cheerio');
//puppeteer
const puppeteer = require('puppeteer');

//expressjs setup
const app = express();
const port = process.env.PORT || 3000;

//expressjs middleware
app.use(express.static('public'));

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    //enable javascript
    await page.setJavaScriptEnabled(true);
    //enable cookies
    await page.setCookie({
        name: 'cookie_name',
        value: 'cookie_value',
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'strict'
    });
    //enable redirects
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://www.blacklistseller.com/report/report_search_success_page?bank_number=&first_name=%E0%B8%9E%E0%B8%87%E0%B8%A8%E0%B8%81%E0%B8%A3&last_name=&idcard=');
    //await page.screenshot({ path: 'example.png' });

    //wait 15 seconds for page to load
    await page.waitFor(15000);

    //get html
    const html = await page.content();
    //console.log(html);
    console.log(html);
  
    await browser.close();
  })();

//expressjs routes
app.get('/', async (req, res) => {
    /*const response = await fetch('https://www.blacklistseller.com/report/report_search_success_page?bank_number=1083835199&first_name=&last_name=&idcard=');
    const body = await response.text();
    res.send(body);

    //cheerio setup
    const $ = cheerio.load(body);
    //cheerio select td elements with class name 'mobile_td'
    const mobile_td = $('td .mobile_td');
    //cheerio console log mobile_td InnerText
    console.log(mobile_td);*/
    /*mobile_td.toArray().forEach(td => {
        console.log('test')
    });*/
});

//expressjs server
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});