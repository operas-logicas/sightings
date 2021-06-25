const _ = require('lodash')
const Like = require('../models/Like')
const Sighting = require('../models/Sighting')
const User = require('../models/User')
const sightingShowResource = require('../resources/sightingShowResource')

class SightingController {
  // Find all sightings
  async index(req, res) {
    const sightingsIndex = []

    try {
      const sightings = await Sighting
        .find({ state: req.query.state })
        .select('-__v')

      for (const sighting of sightings) {
        const user = await User.findById(sighting.user)
        sighting.user_handle = user.handle

        const likes = await Like.find({ sighting: sighting._id })
        sighting.likes = likes.length

        sightingsIndex.push(sightingShowResource(sighting))
      }

      return res.status(200).json({ data: sightingsIndex })

    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  // Find sighting by id
  async show(req, res) {
    try {
      const sighting = await Sighting.findById(req.params.id)
      if (!sighting) return res.status(404).json({ error: 'Sighting not found!' })

      const user = await User.findById(sighting.user)
      sighting.user_handle = user.handle

      const likes = await Like.find({ sighting: sighting._id })
      sighting.likes = likes.length

      return res.status(201).json({ data: sightingShowResource(sighting) })

    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Create new sighting
  // async store(req, res) {

  // }
}

module.exports = new SightingController()
