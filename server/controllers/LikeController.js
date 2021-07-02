const Like = require('../models/Like')
const Sighting = require('../models/Sighting')
const User = require('../models/User')
const { getUserId } = require('../services/AuthService')

class LikeController {
  // Find all likes
  async index(req, res) {
    try {
      const likes = await Like
        .find()
        .select('-__v')

      return res.status(200).json({ data: likes })
      
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  // Create new like
  async store(req, res) {
      // Validate request
      const sighting_id = req.body.sighting
      if (!sighting_id)
        return res.status(422).json({ error: '"sighting" is required' })

    try {
      // Get sighting and check it exists
      const sighting = await Sighting.findById(sighting_id)
      if (!sighting) res.status(500).json({ error: 'Invalid sighting!' })

      // Get user id from auth token
      const user_id = getUserId(req)

      // Get logged in user and check exists
      const user = await User.findById(user_id)
      if (!user) res.status(500).json({ error: 'Invalid user!' })

      // Get like if exists
      const like = await Like.findOne({ sighting: sighting_id, user: user_id })

      // If there's not a like already, create new one
      if (!like) {
        const newLike = new Like({
          sighting: sighting_id,
          user: user_id
        })

        await newLike.save()
        return res.status(201).json({ data: true })

      } else {
        // Else remove existing like
        await like.deleteOne()
        return res.status(204).json()

      }

    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

module.exports = new LikeController()
