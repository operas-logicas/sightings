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
      `Express HTTP server listening on ${httpPort} in ${process.env.NODE_ENV}...`
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
      `Express HTTPS server listening on ${httpsPort} in ${process.env.NODE_ENV}...`
    )
  })
