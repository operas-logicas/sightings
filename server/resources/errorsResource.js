const _ = require('lodash')

module.exports = function(errors) {
  return {
    errors: _.pickBy(errors, x => x.length > 0)
  }
}
