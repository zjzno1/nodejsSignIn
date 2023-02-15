var util = require('../../util.js');

async function nowPage (browser, page) {
    console.log('url match');
    await page.waitForSelector('.code-calender');
    // await page.click('.code-calender');
    await page.evaluate(() => {
        document.querySelector('.signin .code-calender button').click();
    });
    console.log('page click code-calender');
    await util.sleep(2500);
    await page.evaluate(() => {
        // document.querySelector('.signin .code-calender button').click();
        document.querySelector('.success-modal  .byte-modal__headerbtn').click();
    });
    console.log('page evaluate');
    return true;
}

async function actionFn (browser, page) {
    await util.sleep(2000);
    let pageurl = await page.url();
    console.log('pageurl', pageurl);
    if (pageurl.match(/center\/signin/)) {
        nowPage(browser, page);
        return true;
    }
    await page.goto('https://juejin.cn/user/center/signin?avatar_menu', {
        timeout: 0
    });
    console.log('page jump');
    await util.sleep(5000);
    await page.waitForSelector('.code-calender');
    page.click('.code-calender');
    await util.sleep(2500);
    await page.evaluate(() => {
        document.querySelector('.success-modal  .byte-modal__headerbtn').click();
    });
    return true;
}

async function juejinSign (browser, page) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('juejinSign in');
            let res = await actionFn (browser, page);
            resolve(res);
         } catch (e) {
             setTimeout(() => {
                actionFn (browser, page);
             }, 60000);
         }
    })
}

module.exports = juejinSign;