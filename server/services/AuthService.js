const jwt = require('jsonwebtoken')

// Decode and verify auth token
function _decodeAuthToken(req) {
  const token = req.header('authorization')

  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_PRIVATE_KEY)
  } catch (error) {
    return null
  }
}

// Generate auth token
function generateAuthToken(user) {
  const payload = {
    _id: user._id,
    handle: user.handle
  }

  const options = {
    expiresIn: 2 * 60 * 60 // 2 hours
  }

  return jwt.sign(payload, process.env.JWT_PRIVATE_KEY, options)
}

// Get user id from auth token
function getUserId(req) {
  const user = _decodeAuthToken(req)
  if (!user) return null

  return user._id
}

// Require login (auth token) middleware
function requireLogin(req, res, next) {
  const user = _decodeAuthToken(req)
  if (!user)
    return res.status(403).json({ error: 'Not authorized! Please login.' })

  next()
}

module.exports = {
  generateAuthToken,
  getUserId,
  requireLogin
}
