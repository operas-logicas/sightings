const _ = require('lodash')

module.exports = function(user) {
  return _.pick(user, [
    '_id',
    'handle'
  ])
}
