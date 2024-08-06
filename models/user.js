const mongoose = require("mongoose");
const post = require("./post");
mongoose.connect("mongodb://127.0.0.1:27017/authenticatedb");

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  age: Number,
  // contains all the posts written by a particular user
  //an array of type objects where each object stores the id of some other collection(posts here)
  //populate can used to populate this array with the actual data.
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: post,
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
