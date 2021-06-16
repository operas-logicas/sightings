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
    maxLength: 2048
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

sightingSchema.set('timestamps', true)

module.exports = mongoose.model('Sighting', sightingSchema)
