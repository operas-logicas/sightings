const crypto = require('crypto')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true,
    unique: true,
    length: 6
  },

  password: {
    type: String,
    required: true,
    length: 161
  }
})

userSchema.set('timestamps', true)

userSchema.pre('save', function(next) {
  // Hash password
  const salt = crypto.randomBytes(16).toString('hex')

  crypto.scrypt(this.password, salt, 64, (err, derivedKey) => {
    if (err) throw err
    this.password = salt + ':' + derivedKey.toString('hex')
  })

  next()
})

module.exports = mongoose.model('User', userSchema)
