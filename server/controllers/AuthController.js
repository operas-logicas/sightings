const User = require('../models/User')
const errorsResource = require('../resources/errorsResource')
const { generateAuthToken } = require('../services/AuthService')

class AuthController {
  // Login user
  async login(req, res) {
    const errors = {
      handle: [],
      password: []
    }

    // Validate request
    const { error } = User.validateRequestAuth(req.body)
    if (error) {
      // Return errors
      for (const field in error.details)
        errors[error.details[field].path].push(error.details[field].message)

      return res.status(422).json(errorsResource(errors))
    }

    // Validate handle
    const user = await User.findOne({
      handle: req.body.handle
    })
    if (!user) {
      errors.handle.push('Invalid credentials!')
      return res.status(422).json(errorsResource(errors))
    }

    // Validate password
    const passwordsMatch = await User.validatePassword(
      req.body.password, user.password
    )

    if (!passwordsMatch) {
      errors.handle.push('Invalid credentials!')
      return res.status(422).json(errorsResource(errors))
    }

    // Success! So generate and return auth token
    const token = generateAuthToken(user)

    return res.status(201).json({ token })
  }
}

module.exports = new AuthController()
