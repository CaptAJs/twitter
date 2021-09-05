const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  handle: {
    type: String,
    required: true,
    min: 2,
    max: 40,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      handle: {
        type: String,
        required: true,
      },
    },
  ],
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      handle: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Profile = mongoose.model("profile", ProfileSchema);
