var puppeteer = require('puppeteer');
var config = require('../../../config');
var util = require('../../../util.js');
var verCodeHandle = require('../../verificationCode/slide.js');

// document.querySelector('.secsdk-captcha-drag-icon')
// document.querySelector('.captcha_verify_img_slide')

async function loginFn (browser, page) {
    // var browser = await puppeteer.launch({ 
    //     headless: false,
    //     devtools: true
    // });
    // var page = await browser.newPage();
    await page.goto('https://juejin.cn/');
    // util.sleep(1000);
    await page.evaluate(() => {
        document.querySelector('.login-button').click();
    });
    // util.sleep(1000);
    await page.waitForSelector('.auth-modal-box');
    await page.evaluate(() => {
        document.querySelector('.auth-modal-box').querySelector('.clickable').click();
    });
    await util.sleep(1000);
    if (!config.juejin.userName || !config.juejin.password) {
        console.error('do not have username or password, please check');
        return;
    }
    await page.type("input[name='loginPhoneOrEmail']", config.juejin.userName, {delay: 10});
    await page.type("input[name='loginPassword']", config.juejin.password, {delay: 10});
    await util.sleep(500);
    // await page.click('.auth-form');
    await page.click('.auth-modal-box .btn');
    // document.querySelector('.auth-modal-box .btn').click();
    // 解决验证码
    // await util.sleep(1000);
    // 参数 滑动按钮，背景图，小拼图
    let isLoginSuccess = await verCodeHandle('.secsdk-captcha-drag-icon', '#captcha-verify-image', '.captcha_verify_img_slide', '.secsdk_captcha_refresh', page);
    return isLoginSuccess;
}
// #captcha-verify-image
// loginFn();
module.exports = loginFn;