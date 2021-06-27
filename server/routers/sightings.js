const express = require('express')
const multer = require('multer')
const path = require('path')
const sightingController = require('../controllers/SightingController')
const { requireLogin } = require('../services/AuthService')

const router = express.Router()
const upload = multer({
  dest: path.join(__dirname, '/../../public/images/user/'),

  fileFilter: (req, file, callback) => {
    const fileTypes = /png|jpeg|jpg/i

    const extName = fileTypes.test(path.extname(file.originalname))
    const mimeType = fileTypes.test(file.mimetype)

    if (extName && mimeType) callback(null, true)
    else callback('Error! Only .png, .jpeg, and .jpg file types allowed.')
  },

  limits: {
    fileSize: 2048 * 1024 // 2 MB
  }
})

// GET api/sightings
router.get('/', sightingController.index)

// GET api/sightings/:id
router.get('/:id', sightingController.show)

// POST api/sightings
router.post('/', [requireLogin, upload.single('image')], sightingController.store)

module.exports = router
