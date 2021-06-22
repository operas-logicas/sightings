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

  return jwt.sign(payload, process.env.JWT_PRIVATE_KEY)
}

// Require login middleware
function requireLogin(req, res, next) {
  const user = _decodeAuthToken(req)
  if (!user)
    // TODO confirm this is the response we want to send
    return res.status(422).json({ error: 'Not authorized! Please login.' })

  next()
}

module.exports = {
  generateAuthToken,
  requireLogin
}
