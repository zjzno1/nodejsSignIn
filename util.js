var fs = require('fs')
// var mkdirp = require('mkdirp').sync
var { join, resolve } = require('path')

var PNG = require('pngjs').PNG;

// var DATA_DIR = 'data'

module.exports = {
    writeIntermediateFile(name, buf) {
        // mkdirp(DATA_DIR)
        return fs.writeFileSync(join(DATA_DIR, name), buf)
    },
    readIntermediateFile(name, buf) {
        return fs.readFileSync(join(DATA_DIR, name), buf)
    },
    getImageDataFromPng(pngBuf) {
        var png = PNG.sync.read(pngBuf);
        // console.log(77777, png);
        return {
            // colorType: 6,
            // bitDepth: 8,
            // depth: 4,
            // order: 'rgba',
            width: png.width,
            height: png.height,
            data: Uint8ClampedArray.from(png.data)
        }
    },
    createPngFromImageData(imageData) {
        return PNG.sync.write({
            colorType: 6,
            bitDepth: 8,
            width: imageData.width,
            height: imageData.height,
            data: imageData.data
        })
    },
    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(()=>{
                resolve();
            },ms);
        })
    }
}

