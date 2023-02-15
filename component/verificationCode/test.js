var util = require('../../util.js');
var path = require('path');
var fs = require('fs');
var PNG = require('pngjs').PNG;

async function init () {
    let pic = await fs.readFileSync(path.resolve('../../pic/icon2.png'));
    var png = await PNG.sync.read(pic);
    let u8 = Uint8ClampedArray.from(png.data);
    console.log('u8', u8);
    let ws = fs.writeFileSync(path.resolve('../../pic/icon2.txt'), u8);
    var options = { 
        colorType: 4,
        filterType: 4
    };
    var buffer = PNG.sync.write(png, options);
}

init();
