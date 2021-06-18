const _ = require('lodash')
const User = require('../models/User')

class RegisterController {
  // Register new user
  async register(req, res) {
    const errors = {
      handle: [],
      password: [],
      password_confirmation: []
    }

    // Validate request
    const { error } = User.validateUser(req.body)
    if (error) {
      // Return errors
      for (const field in error.details)
        errors[error.details[field].path].push(error.details[field].message)

      return res.status(422).json({ errors: _.pickBy(errors, x => x.length > 0) })
    }

    // Save new user
    try {
      const user = new User({
        handle: req.body.handle,
        password: req.body.password
      })

      await user.save()
      return res.status(201).json({ user_id: user._id })

    } catch (error) {
      if (error.code === 11000) {
        errors.handle.push('"handle" already taken')
        return res.status(422).json({ errors: _.pickBy(errors, x => x.length > 0) })
      }

      return res.status(500).json({ error: error.message })
    }
  }
}

module.exports = new RegisterController()
