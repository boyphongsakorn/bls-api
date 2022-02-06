const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const randomUseragent = require('random-useragent');
const cheerio = require('cheerio');
const proxyChain = require('proxy-chain');
//setup fs
const fs = require('fs');

function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}

(async () => {
    let donevar = false
    let namelist = [];
    //create with donevar = true end the loop
    while (donevar == false) {
        const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

        //const oldProxyUrl = process.env.PROXY_SERVER || 'http://14.207.125.75:8080';
        /*let proxylist = [];
        await fetch('https://www.proxy-list.download/api/v1/get?type=http&country=TH')
            .then(res => res.text())
            .then((body) => {
                proxylist = []
                //console.log(body.split("\r\n"))
                proxylist = body.split("\r\n")
                proxylist.pop()
                console.log(proxylist)
            })
    
        const newProxyUrl = await proxyChain.anonymizeProxy('http://'+random_item(proxylist));*/
        const newProxyUrl = await proxyChain.anonymizeProxy('http://183.89.64.122:8080');
    
        let browser = await puppeteer.launch(
            {
                headless: true, executablePath: process.env.CHROME_BIN || null, args: [
                    '--no-sandbox', '--disable-setuid-sandbox', `--proxy-server=${newProxyUrl}`
                ], ignoreHTTPSErrors: true, dumpio: false
            }
        );

        /*let browser = await puppeteer.launch(
            {
                headless: true, executablePath: process.env.CHROME_BIN || null, args: [
                    '--no-sandbox', '--disable-setuid-sandbox'
                ], ignoreHTTPSErrors: true, dumpio: false
            }
        );*/

        let page = await browser.newPage();
        const userAgent = randomUseragent.getRandom();
        const UA = userAgent || USER_AGENT;

        //Randomize viewport size
        /*await page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 3000 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });*/

        let skip = false;

        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });

        await page.setUserAgent(UA);
        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(0);
        try {
            await page.goto('https://www.blacklistseller.com/report/report_search_success_page?bank_number=&first_name=พงศกร&last_name=', { waitUntil: 'networkidle0',timeout: 60000 });
        } catch (error) {
            donevar = false
            skip = true
        }
        
        try {
            const testhtml = await page.content();
            /*$('a').toArray().forEach(function (element) {
                if (element.firstChild.data == 'Cloudflare') {
                    skip = true;
                }
            });*/
            //console.log(testhtml)
            const $ = cheerio.load(testhtml);
            $('a').toArray().forEach(element => {
                if (element.firstChild.data == 'Cloudflare' || element.firstChild.data == 'www.blacklistseller.com') {
                    skip = true;
                    donevar = false;
                    console.log(element.firstChild.data)
                }else{
                    console.log('wait')
                    console.log(element.firstChild.data)
                }
                //console.log(element.firstChild.data)
            });
        } catch (error) {
            //skip loop
            //donevar = false;
            skip = true;
        }

        if (!skip) {
            //get html
            const html = await page.content();
            //console.log(html);
            //console.log(html);

            await browser.close();

            const $ = cheerio.load(html);
            //cheerio select td elements with class name 'mobile_td'
            const mobile_td = $('td .mobile_td');
            //cheerio console log mobile_td InnerText
            //console.log(mobile_td);
            //console.log(mobile_td)
            //let hee = 0;
            let flname
            /*$('a').toArray().forEach(function (element) {
                if (element.firstChild.data == 'Cloudflare') {
                    skip = true;
                }
            });
            if(skip != true){
                mobile_td.toArray().forEach(element => {
                    //console.log(element.firstChild.data)
                    try {
                        console.log(mobile_td.toArray().length)
                        console.log(element.firstChild.data)
                        console.log(hee)
                        hee++;
                    } catch (error) {
                        console.log('firstChild.data not found')
                    }
                });
            }*/
            //console.log(mobile_td.toArray()[7].firstChild.data)
            /*if (mobile_td.toArray().length > 5) {
                if(mobile_td.toArray()[7].firstChild.data) {
                    donevar = true;
                }
            }*/
            //if (flname) {
            donevar = true;
            //}
            /*$('a').toArray().forEach(element => {
                if (element.firstChild.data == 'Cloudflare') {
                    skip = true;
                    donevar = false;
                }
                console.log(element.firstChild.data)
            });*/
            let hee = 0;
            console.log(mobile_td.toArray().length)
            mobile_td.toArray().forEach(element => {
                //console.log(element.firstChild.data)
                try {
                    //console.log(mobile_td.toArray().length)
                    console.log('---')
                    //console.log(element.firstChild.data)
                    //get innerHTML of element
                    console.log(element.html())
                    //write to file
                    fs.writeFileSync(hee+'.txt', element.html());
                    console.log(element.text())
                    console.log('---')
                    //console.log(hee)
                    hee++;
                } catch (error) {
                    console.log('firstChild.data not found')
                }
            });
            //check browser is closed
            if (donevar) {
                //end loop
                donevar = true;
            }
        }
    }
})();