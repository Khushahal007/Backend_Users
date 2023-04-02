const mongoose = require('mongoose');

const blockedUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  blockedAt: {
    type: Date,
    default: Date.now,
  },
});

const blockedUserModel = mongoose.model('BlockedUser', blockedUserSchema);

module.exports = blockedUserModel;
