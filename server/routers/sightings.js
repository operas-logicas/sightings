const express = require('express')
const sightingController = require('../controllers/SightingController')
// const { requireLogin } = require('../services/AuthService')

const router = express.Router()

// GET api/sightings
router.get('/', sightingController.index)

// GET api/sightings/:id
router.get('/:id', sightingController.show)

// POST api/sightings
// router.post('/:id', requireLogin, sightingController.store)

module.exports = router
