import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const schema = mongoose.Schema;

const userSchema = new schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  skills: {
    type: Array
  }
}, { timestamp: true });

module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function (newUser,callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserByUsername = function (email, callback) {
  const query = {email: email};
  User.findOne(query).then((user)=>{
    callback(null, user);
  }).catch(error=>{
    callback(error, null);
  });
};
//mongodb functions
module.exports.getUserById = function (id,callback) {
  User.findById(id,callback);
};

module.exports.comparePassword = function (candidatePassword,hash,callback) {
  bcrypt.compare(candidatePassword, hash, function (error,isMatch) {
    if (error) throw error;
    callback(null, isMatch);
  });
};



