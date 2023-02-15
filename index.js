var puppeteer = require('puppeteer');
var util = require('./util.js');

let juejinLogin = require('./component/login/project/juejin.js');
let juejinSign = require('./component/sign/juejinSign.js');
let schedule = require('node-schedule');
let browser;
async function init() {
    if (!browser) {
        browser = await puppeteer.launch({
            width: 2000,
            height: 1000,
            ignoreHTTPSErrors: true,
            headless: true,
            devtools: false,
            // args: ['--single-process'],
            args: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],
            env: {
                DISPLAY: ":10.0"
            }
        });
    }
    let page = await browser.newPage();
    let isLoginSuccess = await juejinLogin(browser, page);
    console.log('isLoginSuccess', isLoginSuccess);
    if (isLoginSuccess) {
        await juejinSign(browser, page);
        await schedule.scheduleJob('5 0 8 * * *', function () {
            console.log('schedule run');
            juejinSign(browser, page);
        });
        console.log('sign success');
    } else {
        console.error('login Err');
    }
    // 监听浏览器关闭或者崩溃
    browser.on('disconnected', async () => {
        console.log('browser crashed');
        init();
    });
}

init();



