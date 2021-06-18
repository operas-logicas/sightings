const express = require('express')
const userController = require('../controllers/UserController')

const router = express.Router()

// GET api/users
router.get('/:id', userController.index)

// GET api/users/:id
router.get('/', userController.show)

module.exports = router
