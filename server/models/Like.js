const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
  sighting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sighting'
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

likeSchema.set('timestamps', true)

module.exports = mongoose.model('Like', likeSchema)
