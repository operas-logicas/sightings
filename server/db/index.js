const express = require('express')
const readline = require('readline')
const connectToMongoDB = require('../config/db')
const setEnvironment = require('../config/env')
const likesSeeder = require('./likesSeeder')
const sightingsSeeder = require('./sightingsSeeder')
const usersSeeder = require('./usersSeeder')

const app = express();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const rollbackAndSeedDb = async function() {
  // Initialization
  setEnvironment(app)
  await connectToMongoDB()

  // Rollback and seed collections
  await usersSeeder()
  await sightingsSeeder()
  await likesSeeder()
}

const init = async function() {
  // If production environment detected, confirm user wants to do this!
  if (process.env.NODE_ENV === 'production') {
    console.log('\n\x1b[31m%s\x1b[0m', 'Detected production environment!')

    rl.question(
      'Are you sure you want to rollback and seed the db? (All data will be lost!)\nYES / NO ',
      async answer => {
        // If yes, rollback and seed db
        if (answer.toLowerCase() === 'yes') {
          console.log('\n')
          await rollbackAndSeedDb()
          
        } else console.log('\n')

        rl.close()

        // Exit
        process.exit()
      })

  } else {
    // If not production environment, just rollback and seed db
    console.log('\n')
    await rollbackAndSeedDb()

    // Exit
    process.exit()
  }
}

init()
