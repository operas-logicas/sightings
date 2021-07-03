const mongoose = require('mongoose')

module.exports = async function() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('\x1b[36m%s\x1b[0m\n', `Connected to ${process.env.DB_URL}`)

  } catch (error) {
    console.log('\n\x1b[31m%s\x1b[0m\n', 'Unable to connect to MongoDB!');
    throw error
  }
}
