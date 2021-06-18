const fs = require('fs')

module.exports = {
  devServer: {
    host: 'localhost',
    https: {
      key: fs.readFileSync('./https/key.pem'),
      cert: fs.readFileSync('./https/cert.pem')
    },
    progress: false
  }
}
