// 滑动方式验证
var util = require('../../util.js');
var mouseTrackFn = require('./lib/slidingTrack');
var locate = require('../verificationCode/lib/locate.js');
var Random = require('random-js')();
var path = require('path');
var fs = require('fs');

function mouseMovePositionFn(xLeft, yTop, width, height) {
    return [
        Random.integer(xLeft + 0.3 * width, xLeft + 0.7 * width),
        Random.integer(yTop + 0.3 * height, yTop + 0.7 * height)
    ]
}

function grayingFn(arr) {
    var width = arr.length / 4
    let ret = new Uint8ClampedArray(arr.length)
    for (let i = 0; i !== width; ++i) {
        ret[i*4] = ret[i*4+1] =ret[i*4+2] = Math.max(arr[i*4], arr[i*4+1], arr[i*4+2])
        ret[i*4+3] = 255    // alpha
    }
    return ret
}
let isSuccess;

async function slideFn (knob, wrap, icon, reTrySelector, page) {
    var knobObj = await page.waitForSelector(knob);
    var knobRect = await knobObj.boundingBox();
    // 获取滑块位置
    var [ startX, startY ] = mouseMovePositionFn(knobRect.x, knobRect.y, knobRect.width, knobRect.height);
    console.log('startX, startY', startX, startY);
    // 鼠标移动到滑块上
    await page.mouse.move(startX, startY);
    await util.sleep(1000);

    // 获取icon
    var captchaIcon = await page.$(icon);
    var IconRect = await captchaIcon.boundingBox();
    // 先隐藏背景再截图
    await page.evaluate((wrap) => {
        document.querySelector(wrap).style.display = 'none';
    }, wrap); 
    // path: path.resolve('./pic/icon.png')
    var imageIcon = await page.screenshot({type: 'png', encoding: 'binary', clip: IconRect })
    var pixelsIcon = util.getImageDataFromPng(imageIcon);
    pixelsIcon.x = IconRect.x;
    pixelsIcon.y = IconRect.y;
    pixelsIcon.grayBuf = grayingFn(pixelsIcon.data);

    // 获取背景
    await page.evaluate((icon, wrap) => {
        document.querySelector(icon).style.display = 'none';
        document.querySelector(wrap).style.display = 'block';
    }, icon, wrap);
    var captchaWrap = await page.$(wrap);
    var wrapRect = await captchaWrap.boundingBox();
    // 先隐藏拼图再截图
    var imageWrap = await page.screenshot({type: 'png', encoding: 'binary', clip: {
        x: IconRect.x,
        y: IconRect.y,
        width: wrapRect.width,
        height: IconRect.height
    }});

    var pixelsWrap = util.getImageDataFromPng(imageWrap);
    pixelsWrap.x = wrapRect.x;
    pixelsWrap.y = wrapRect.y;
    pixelsWrap.grayBuf = grayingFn(pixelsWrap.data);
    await page.evaluate((icon, wrap) => {
        document.querySelector(icon).style.display = 'block';
        document.querySelector(wrap).style.display = 'block';
    }, icon, wrap); 

    await page.mouse.down();
    await util.sleep(1000);
    let xOffset = await locate(page, pixelsIcon, pixelsWrap);
    // xOffset = 100;
    xOffset -= 6;
    console.log('xOffset', xOffset);
    if (xOffset === null || xOffset < 0) {
        await page.evaluate((reTrySelector)=>{
            document.querySelector(reTrySelector).click();
        }, reTrySelector)
        util.sleep(3000);
        await slideFn(knob, wrap, icon, reTrySelector, page);
    };

    // simulate mouse track
    var mouseTrack = mouseTrackFn(xOffset);

    for (let [xDelta, delay] of mouseTrack) {
        await page.mouse.move(startX + xDelta, startY)
        await util.sleep(delay)
    }

    await util.sleep(Random.integer(300, 750))
    await page.mouse.up()
    isSuccess = await page.waitForSelector('.avatar-wrapper', { timeout: 6000 }).then(_ => true, _ => false)
    if (!isSuccess) {
        await slideFn(knob, wrap, icon, reTrySelector, page);
    }
    return isSuccess;
}

module.exports = slideFn;
