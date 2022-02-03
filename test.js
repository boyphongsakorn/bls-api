const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const randomUseragent = require('random-useragent');
const cheerio = require('cheerio');
const proxyChain = require('proxy-chain');

function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}

(async () => {
    let donevar = false;
    //loop 100 times
    for (let i = 0; i < 100; i++) {
        //create with donevar = true end the loop
        while (!donevar) {
            const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

            //const oldProxyUrl = process.env.PROXY_SERVER || 'http://14.207.125.75:8080';
            /*let proxylist = [];
            await fetch('https://www.proxy-list.download/api/v1/get?type=http')
                .then(res => res.text())
                .then((body) => {
                    proxylist = []
                    //console.log(body.split("\r\n"))
                    proxylist = body.split("\r\n")
                    proxylist.pop()
                    console.log(proxylist)
                })
        
            const newProxyUrl = await proxyChain.anonymizeProxy('http://'+random_item(proxylist));
            //const newProxyUrl = await proxyChain.anonymizeProxy('http://47.56.69.11:8000');
        
            let browser = await puppeteer.launch(
                {
                    headless: true, executablePath: process.env.CHROME_BIN || null, args: [
                        '--no-sandbox', '--disable-setuid-sandbox', `--proxy-server=${newProxyUrl}`
                    ], ignoreHTTPSErrors: true, dumpio: false
                }
            );*/

            let browser = await puppeteer.launch(
                {
                    headless: true, executablePath: process.env.CHROME_BIN || null, args: [
                        '--no-sandbox', '--disable-setuid-sandbox'
                    ], ignoreHTTPSErrors: true, dumpio: false
                }
            );

            let page = await browser.newPage();
            const userAgent = randomUseragent.getRandom();
            const UA = userAgent || USER_AGENT;

            //Randomize viewport size
            await page.setViewport({
                width: 1920 + Math.floor(Math.random() * 100),
                height: 3000 + Math.floor(Math.random() * 100),
                deviceScaleFactor: 1,
                hasTouch: false,
                isLandscape: false,
                isMobile: false,
            });

            await page.setUserAgent(UA);
            await page.setJavaScriptEnabled(true);
            await page.setDefaultNavigationTimeout(0);
            await page.goto('https://www.blacklistseller.com/report/report_preview/'+(i+1), { waitUntil: 'networkidle0' });

            //if page has notfound class, then it means the page is not found
            if (await page.$('.notfound') !== null) {
                console.log('Page not found');
                await browser.close();
                donevar = true;
                break;
            }

            //get html
            const html = await page.content();
            //console.log(html);
            console.log(html);

            await browser.close();

            const $ = cheerio.load(html);
            //cheerio select td elements with class name 'mobile_td'
            const mobile_td = $('a');
            //cheerio console log mobile_td InnerText
            //console.log(mobile_td);
            //console.log(mobile_td)
            let hee = 0;
            mobile_td.toArray().forEach(element => {
                //console.log(element.firstChild.data)
                try {
                    if (element.firstChild.data != 'Cloudflare') {
                        hee++;
                        console.log(element.firstChild.data)
                        console.log(hee)
                    }
                } catch (error) {
                    console.log('firstChild.data not found')
                }
            });
            console.log(mobile_td.toArray()[11].firstChild.data)
            if (mobile_td.toArray()[11].firstChild.data) {
                donevar = true;
            }
        }
    }
})();