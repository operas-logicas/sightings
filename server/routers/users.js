const express = require('express')
const userController = require('../controllers/UserController')
const { requireLogin } = require('../services/AuthService')

const router = express.Router()

// GET api/users
router.get('/', requireLogin, userController.index)

// GET api/users/:id
router.get('/:id', requireLogin, userController.show)

module.exports = router
