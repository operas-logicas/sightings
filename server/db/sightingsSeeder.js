const _ = require('lodash')
const SightingFactory = require('./factories/SightingFactory')
const Sighting = require('../models/Sighting')
const User = require('../models/User')

const _sightings = []

module.exports = async function() {
  console.log('Rolling back sightings collection...')
  await Sighting.deleteMany({})

  console.log('Seeding sightings...')
  const users = await User.find()
  users.forEach(user => {
    for (let i = 0; i < _.random(3); i++ ) {
      const sighting = new SightingFactory()
      sighting.user = user._id
      _sightings.push(sighting)
    }
  })
  await Sighting.collection.insertMany(_sightings)
  console.log('Done!\n')
}
