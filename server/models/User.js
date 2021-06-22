const crypto = require('crypto')
const Joi = require('joi')
const mongoose = require('mongoose')
const { promisify } = require('util')

const scrypt = promisify(crypto.scrypt)

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
userSchema.statics.validateRequestUser =
  body => {
    const schema = Joi.object({
      handle: Joi.string()
        .required()
        .length(6),

      password: Joi.string()
        .required()
        .min(8)
        .max(50),

      password_confirmation: Joi.string()
        .required()
        .valid(Joi.ref('password'))
    })

    return schema.validate(body, { abortEarly: false })
  }

// Validate request - auth (login)
userSchema.statics.validateRequestAuth =
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

    return schema.validate(body, { abortEarly: false })
  }

// Validate password
userSchema.statics.validatePassword =
  async (password, hashed) => {
    const [salt, hash] = hashed.split(':')

    const bufferKey = Buffer.from(hash, 'hex')
    const derivedKey = await scrypt(password, salt, 64)

    return crypto.timingSafeEqual(bufferKey, derivedKey)
  }

// Hash password on save
userSchema.pre('save', async function(next) {
  const salt = crypto.randomBytes(16).toString('hex')

  const derivedKey = await scrypt(this.password, salt, 64)
  this.password = salt + ':' + derivedKey.toString('hex')

  next()
})

module.exports = mongoose.model('User', userSchema)
