const _ = require('lodash')
const multer = require('multer')
const path = require('path')
const Sighting = require('../models/Sighting')
const errorsResource = require('../resources/errorsResource')

module.exports = function(req, res, next) {
  const upload = multer({
    dest: path.join(__dirname, '/../../public/images/user/'),
  
    fileFilter: (req, file, callback) => {
      const fileTypes = /png|jpeg|jpg/i
  
      const extName = fileTypes.test(path.extname(file.originalname))
      const mimeType = fileTypes.test(file.mimetype)
  
      if (extName && mimeType) callback(null, true)
      else callback(new Error('Only .png, .jpeg, and .jpg file types allowed'))
    },
  
    limits: {
      fileSize: 2048 * 1024 // 2 MB
    }
  }).single('image')

  const errors = {
    title: [],
    date: [],
    description: [],
    location: [],
    image: []
  }

  // Upload image
  upload(req, res, uploadError => {
    if (uploadError) errors.image.push(uploadError.message)

    // Validate request
    const { error: requestErrors } = Sighting.validateRequest(req.body)
    if (requestErrors) {
      for (const field in requestErrors.details) {
        if (requestErrors.details[field].path == 'state')
          errors.location.push(requestErrors.details[field].message)
        else
          errors[requestErrors.details[field].path].push(requestErrors.details[field].message)
      }
    }

    // Return errors if any
    if (_.some(errors, err => err.length > 0))
      return res.status(422).json(errorsResource(errors))

    next()
  })
}
