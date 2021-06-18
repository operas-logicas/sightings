const crypto = require('crypto')
const Joi = require('joi')
const mongoose = require('mongoose')
const passwordComplexity = require('joi-password-complexity')

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

// Validate request - user (register)
userSchema.statics.validateUser =
  body => {
    const schema = Joi.object({
      handle: Joi.string()
        .required()
        .length(6),

      password: passwordComplexity({
        min: 8,
        max: 50,
        numeric: 1,
        symbol: 1
      }),

      password_confirmation: Joi.string()
        .required()
        .valid(Joi.ref('password'))
    })

    return schema.validate(body)
  }

// Validate request - auth (login)
userSchema.statics.validateAuth =
  body => {
    const schema = Joi.object({
      handle: Joi.string()
        .required()
        .length(6),
      
      password: Joi.string()
        .required()
        .min(8)
        .max(50)
    })

    return schema.validate(body)
  }

// Hash password
userSchema.pre('save', function(next) {
  const salt = crypto.randomBytes(16).toString('hex')

  crypto.scrypt(this.password, salt, 64, (err, derivedKey) => {
    if (err) throw err
    this.password = salt + ':' + derivedKey.toString('hex')
  })

  next()
})

module.exports = mongoose.model('User', userSchema)
