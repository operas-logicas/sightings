const User = require('../models/User')

class RegisterController {
  // Register new user
  async register(req, res) {
    // Validate request
    const { error } = User.validateUser(req.body)
    if (error)
      return res.status(422).send(error.details)

    // Save new user
    try {
      const user = new User({
        handle: req.body.handle,
        password: req.body.password
      })

      await user.save()
      return res.status(201).json({ user_id: user._id })

    } catch (error) {
      if (error.code === 11000)
        return res.status(422).json({ error: 'Handle already taken!' })

      return res.status(500).json({ error: 'Something went wrong! '})
    }
  }
}

module.exports = new RegisterController()
