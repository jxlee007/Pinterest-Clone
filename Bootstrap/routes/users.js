const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// setup connection
mongoose.connect('mongodb://127.0.0.1:27017/Pin-Interest')

// make userSchema for  userModels 
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
   
  // 
  DP: {
    type: String,
    default: 'default.jpg', // Set a default value or customize as needed
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);


