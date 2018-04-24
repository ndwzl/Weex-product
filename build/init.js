var fs = require('fs')
var path = require('path')
var ip = require('ip').address()
fs.writeFileSync(path.resolve('config.js'), 'module.exports = \'' + ip + '\'')
