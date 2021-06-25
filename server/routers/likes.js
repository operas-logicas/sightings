const express = require('express')
const likeController = require('../controllers/LikeController')

const router = express.Router()

// GET api/likes
router.get('/', likeController.index)

module.exports = router
