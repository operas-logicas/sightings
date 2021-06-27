const Joi = require('joi')
const mongoose = require('mongoose')

const sightingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255
  },

  date: {
    type: Date,
    required: true
  },

  description: {
    type: String,
    required: true,
    minLength: 3
  },

  location: {
    type: String,
    required: true,
    match: /^-?\d+.?\d*,{1}-?\d+.?\d*$/
  },

  state: {
    type: String,
    required: true,
    minLength: 2
  },
  
  img_path: {
    type: String,
    maxLength: 255
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

sightingSchema.set('timestamps', true)

// Validate request - sightings
sightingSchema.statics.validateRequest =
  body => {
    const schema = Joi.object({
      title: Joi.string()
        .required()
        .min(3)
        .max(255),

      date: Joi.date()
        .required(),

      description: Joi.string()
        .required()
        .min(3),

      // TODO pattern and custom message
      location: Joi.string()
        .required(),

      state: Joi.string()
        .required()
        .min(2),

      image: Joi.any()
        .meta({ swaggerType: 'file' })
        .optional()
        .description('image file')
    })

    return schema.validate(body, { abortEarly: false })
  }

module.exports = mongoose.model('Sighting', sightingSchema)
