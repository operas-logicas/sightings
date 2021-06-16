const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
  sighting_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sighting'
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

likeSchema.set('timestamps', true)

module.exports = mongoose.model('Like', likeSchema)
