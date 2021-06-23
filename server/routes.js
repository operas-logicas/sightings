const auth = require('./routers/auth')
const register = require('./routers/register')
const sightings = require('./routers/sightings')
const users = require('./routers/users')

module.exports = function(app) {
  app.use('/api/auth', auth)
  app.use('/api/register', register)
  app.use('/api/sightings', sightings)
  app.use('/api/users', users)
}
