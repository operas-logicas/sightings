const User = require('../models/User')
const userShowResource = require('../resources/userShowResource')

class UserController {
  // Find all users
  async index(req, res) {
    try {
      const users = await User
        .find()
        .sort('handle')
        .select('-password -__v')
      
      return res.status(200).json({ users })

    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  // Find user by id
  async show(req, res) {
    try {
      const user = await User.findById(req.params.id)
      if (!user) return res.status(404).json({ error: 'User not found!' })

      return res.status(201).json(userShowResource(user))

    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

module.exports = new UserController()
