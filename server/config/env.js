const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const history = require('connect-history-api-fallback')
const morgan = require('morgan')

function setDevEnv(app) {
  // Set environment vars
  process.env.NODE_ENV = 'development'
  process.env.HTTP_PORT = 3000
  process.env.HTTPS_PORT = 3001
  process.env.DB_URL = 'mongodb://localhost:27017/sightings'
  process.env.JWT_PRIVATE_KEY = 'superSecretPrivateKeyForDevelopmentOnly'

  // Register middleware
  app.use(express.json())
  app.use(morgan('dev'))
  app.use(cors())
}

function setProdEnv(app) {
  // Check for environment vars
  if (!process.env.DB_URL) {
    console.log('Fatal Error! DB_URL is undefined.')
    process.exit(1)
  }

  if (!process.env.JWT_PRIVATE_KEY) {
    console.log('Fatal Error! JWT_PRIVATE_KEY is undefined.')
    process.exit(1)
  }

  if (!process.env.HTTP_PORT) process.env.HTTP_PORT = 5000
  if (!process.env.HTTPS_PORT) process.env.HTTPS_PORT = 5001

  // Register middleware
  app.use(express.json())
  app.use(
    '/images/user',
    express.static(__dirname + '/../../public/images/user/')
  )
  app.use(history())
  app.use(express.static(__dirname + '/../../dist/'))
  app.use(helmet())
  app.use(compression())
}

module.exports = function(app) {
  if (process.env.NODE_ENV !== 'production') setDevEnv(app)
  else setProdEnv(app)
}
