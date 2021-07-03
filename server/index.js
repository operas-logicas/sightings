const express = require('express')
const fs = require('fs')
const http = require('http')
const https = require('https')
const connectToMongoDB = require('./config/db')
const setEnvironment = require('./config/env')
const registerRoutes = require('./routes')

const app = express()

// Initialization
setEnvironment(app)
connectToMongoDB()
registerRoutes(app)

app.get('/', (req, res) => {
  if (process.env.NODE_ENV !== 'production')
    return res.send('Running server in development mode.')
  else
    return res.sendFile('index.html', { root: __dirname + '/../dist/'})
})

// Start HTTP server
const httpPort = process.env.HTTP_PORT

http.createServer(app)
  .listen(httpPort, () => {
    console.log(
      `\nExpress \x1b[33m%s\x1b[0m server listening on \x1b[33m%s\x1b[0m in ${
        process.env.NODE_ENV === 'production'
          ? '\x1b[35m%s\x1b[0m'
          : '\x1b[34m%s\x1b[0m'
        }...`, 'HTTP', httpPort, process.env.NODE_ENV
    )
  })

// Start HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync(__dirname + '/../https/key.pem'),
  cert: fs.readFileSync(__dirname + '/../https/cert.pem')
}

const httpsPort = process.env.HTTPS_PORT

https.createServer(httpsServerOptions, app)
  .listen(httpsPort, () => {
    console.log(
      `Express \x1b[32m%s\x1b[0m server listening on \x1b[32m%s\x1b[0m in ${
        process.env.NODE_ENV === 'production'
          ? '\x1b[35m%s\x1b[0m'
          : '\x1b[34m%s\x1b[0m'
        }...\n`, 'HTTPS', httpsPort, process.env.NODE_ENV
    )
  })
