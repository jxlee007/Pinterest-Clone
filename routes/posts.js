const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true,
  },
  image:{
    type: String,
  },
//   make sense in future using array,def=[] instead of number,def=0
// In likes we will save user IDs in array To know that which user has liked that post
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user:{
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
  },
});

module.exports = mongoose.model('Post', postSchema);


 