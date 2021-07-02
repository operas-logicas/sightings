const moment = require('moment')
const Like = require('../models/Like')
const Sighting = require('../models/Sighting')
const User = require('../models/User')
const sightingShowResource = require('../resources/sightingShowResource')
const { getUserId } = require('../services/AuthService')

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
  async store(req, res) {
    // Get user id from auth token
    const user_id = getUserId(req)

    // Get logged in user
    const user = await User.findById(user_id)
    if (!user) res.status(500).json({ error: 'Invalid user! '})

    // Save new sighting
    try {
      const sighting = new Sighting({
        title: req.body.title,
        date: moment.utc(req.body.date).toDate(),
        description: req.body.description,
        location: req.body.location,
        state: req.body.state,
        img_path: req.file ? '/images/user/' + req.file.filename : '',
        user
      })

      await sighting.save()

      // Add user_handle and likes to the response
      sighting.user_handle = user.handle
      sighting.likes = 0

      return res.status(201).json({ data: sightingShowResource(sighting) })

    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

module.exports = new SightingController()
