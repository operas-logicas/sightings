const express = require('express')
const connectToMongoDB = require('../config/db')
const setEnvironment = require('../config/env')
const usersSeeder = require('./usersSeeder')

const app = express();

(async function() {
  // Initialization
  setEnvironment(app)
  await connectToMongoDB()

  // Rollback and seed collections
  await usersSeeder()

  // Exit
  process.exit()
})()
