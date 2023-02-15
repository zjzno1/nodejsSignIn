var Random = require('random-js')()
var Easing = require('d3-ease')

module.exports = function timedEase(xOffset) {
    var numSlices = Math.floor(xOffset / 3) + Random.integer(-3, 5)
    var easingParam = Math.random() / 2 + 0.9
    let ret = []
    for (let i = 0; i !== numSlices; ++i) {
        var xDelta = Math.floor(Easing.easeBackOut((i+1) / numSlices, easingParam) * xOffset)
        ret.push([xDelta, 33 + Random.integer(-12, 24)])
    }
    return ret
}