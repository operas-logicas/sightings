const express = require('express')
const likeController = require('../controllers/LikeController')
const { requireLogin } = require('../services/AuthService')

const router = express.Router()

// GET api/likes
router.get('/', likeController.index)

// POST api/likes
router.post('/', requireLogin, likeController.store)

module.exports = router
