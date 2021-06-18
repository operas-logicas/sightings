const fs = require('fs')

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync('./https/key.pem'),
      cert: fs.readFileSync('./https/cert.pem')
    },
    progress: false
  }
}
