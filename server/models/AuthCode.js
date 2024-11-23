const mongoose = require('mongoose')

const authCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const AuthCode = mongoose.model('AuthCode', authCodeSchema)

module.exports = AuthCode
