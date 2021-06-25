const _ = require('lodash')
const Like = require('../models/Like')
const Sighting = require('../models/Sighting')
const User = require('../models/User')

const _likes = []

module.exports = async function() {
  console.log('Rolling back likes collection...')
  await Like.deleteMany({})

  console.log('Seeding likes...')
  const sightings = await Sighting.find()

  for (const sighting of sightings) {
    const likes = _.random(1)
      ? (_.random(1)
        ? _.random(12, 27)
        : _.random(4, 11))
      : _.random(3)

    const count = await User.countDocuments()

    for (let i = 0; i < likes; i++) {
      const user = await User.findOne().skip(_.random(count - 1))

      _likes.push({
        sighting: sighting._id,
        user: user._id
      })
    }
  }

  await Like.collection.insertMany(_likes)
  console.log('Done!\n')
}
