const _ = require('lodash')

module.exports = function(sighting) {
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
