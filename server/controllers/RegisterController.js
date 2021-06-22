const User = require('../models/User')
const errorsResource = require('../resources/errorsResource')
const userShowResource = require('../resources/userShowResource')

class RegisterController {
  // Register new user
  async register(req, res) {
    const errors = {
      handle: [],
      password: [],
      password_confirmation: []
    }

    // Validate request
    const { error } = User.validateRequestUser(req.body)
    if (error) {
      // Return errors
      for (const field in error.details)
        errors[error.details[field].path].push(error.details[field].message)

      return res.status(422).json(errorsResource(errors))
    }

    // Save new user
    try {
      const user = new User({
        handle: req.body.handle,
        password: req.body.password
      })

      await user.save()

      return res.status(201).json(userShowResource(user))

    } catch (error) {
      if (error.code === 11000) {
        errors.handle.push('"handle" already taken')
        return res.status(422).json(errorsResource(errors))
      }

      return res.status(500).json({ error: error.message })
    }
  }
}

module.exports = new RegisterController()
