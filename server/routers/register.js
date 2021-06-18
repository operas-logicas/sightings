const express = require('express')
const registerController = require('../controllers/RegisterController')

const router = express.Router()

// POST api/register
router.post('/', registerController.register)

module.exports = router
