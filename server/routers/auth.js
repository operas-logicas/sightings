const express = require('express')
const authController = require('../controllers/AuthController')

const router = express.Router()

// POST api/auth
router.post('/', authController.login)

module.exports = router
