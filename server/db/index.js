const express = require('express')
const connectToMongoDB = require('../config/db')
const setEnvironment = require('../config/env')
const likesSeeder = require('./likesSeeder')
const sightingsSeeder = require('./sightingsSeeder')
const usersSeeder = require('./usersSeeder')

const app = express();

(async function() {
  // Initialization
  setEnvironment(app)
  await connectToMongoDB()

  // Rollback and seed collections
  await usersSeeder()
  await sightingsSeeder()
  await likesSeeder()

  // Exit
  process.exit()
})()
