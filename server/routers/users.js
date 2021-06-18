const express = require('express')
const userController = require('../controllers/UserController')

const router = express.Router()

// GET api/users
router.get('/', userController.index)

// GET api/users/:id
router.get('/:id', userController.show)

module.exports = router
