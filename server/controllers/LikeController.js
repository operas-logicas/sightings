const Like = require('../models/Like')
// const Sighting = require('../models/Sighting')
// const User = require('../models/User')

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
}

module.exports = new LikeController()
