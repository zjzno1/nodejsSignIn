var PNG = require('pngjs').PNG;
var fs = require('fs');
var path = require('path');

// // 计算出icon的大小及位置
// async function sliceIcon (icon) {
//     let blockIcon = await binarizeFn(icon.data);
// }

// // 计算出icon最上下左右的顶点
// async function calculateSizeFn (iconBuf) {
    
// }

// 灰度化
// function grayingFn (bufferArray) {
//     var options = { 
//         colorType: 0
//     };
//     return PNG.sync.write(bufferArray, options);
// }

// 二值化
function binarizeFn(arr, threshold = 48) {
    var width = arr.length / 4
    let ret = new Uint8ClampedArray(arr.length)
    for (let i = 0; i !== width; ++i) {
        ret[i*4] = ret[i*4+1] =ret[i*4+2] = Math.max(arr[i*4], arr[i*4+1], arr[i*4+2]) > threshold ? 0 : 255;
        ret[i*4+3] = 255    // alpha
    }
    return ret
}

// 滑动距离，判断当前竖线黑色点是否大于1/3，如果大于，则滑动距离为 当前线到初始位置的距离
function offsetXFn (width, height, bufArray) {
    let count = 0;
    let offsetX = null;
    console.log(7878, width, height, bufArray[0])
    for(let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (bufArray[(j*4*width)+(i*4)] == 0) {
                count++;
            }
        }
        if (count > (height/3)) {
            offsetX = i; // 移动距离
            break;
        }
        count = 0;
    };
    return offsetX;
}

module.exports = async function (page, icon, wrap) {
    let blackWrapBuf = await binarizeFn(wrap.grayBuf, 245);
    let offset = offsetXFn(wrap.width, wrap.height, blackWrapBuf);
    console.log('offset111', offset);
    return offset;
}
