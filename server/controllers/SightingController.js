const Sighting = require('../models/Sighting')
const sightingIndexResource = require('../resources/sightingIndexResource')
const sightingShowResource = require('../resources/sightingShowResource')

class SightingController {
  // Find all sightings
  async index(req, res) {
    try {
      const sightings = await Sighting
        .find({ state: req.query.state })
        .select('-__v')

      return res.status(200).json(sightingIndexResource(sightings))

    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  // Find sighting by id
  async show(req, res) {
    try {
      const sighting = await Sighting.findById(req.params.id)
      if (!sighting) return res.status(404).json({ error: 'Sighting not found!' })

      return res.status(201).json(sightingShowResource(sighting))

    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Create new sighting
  async store(req, res) {

  }
}

module.exports = new SightingController()
