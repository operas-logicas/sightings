const _ = require('lodash')
const User = require('../models/User')

module.exports = async function(sighting) {
  sighting.user_handle = await User
    .findById(sighting.user._id)
    .select('handle')

  // TODO get likes from likes collection
  sighting.likes = 5

  return _.pick(sighting, [
    '_id',
    'title',
    'date',
    'description',
    'location',
    'state',
    'img_path',
    'user_handle',
    'likes'
  ])
}
