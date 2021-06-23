const { str_shuffle } = require('locutus/php/strings')
const User = require('../models/User')

class UserFactory {
  constructor() {
    this.handle = str_shuffle('abcdef0123456789').slice(0, 6)
    this.password = 'password'
  }
}

const _users = 50

module.exports = async function() {
  console.log('Rolling back users collection...')
  await User.deleteMany({})

  console.log('Seeding users...')
  for (let i = 0; i < _users; i++) {
    await User.create(new UserFactory())
  }

  console.log('Done!')
}
