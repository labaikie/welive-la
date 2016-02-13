var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var bcrypt        = require('bcrypt');

//
// DEFINE USER SCHEMA
//
var userSchema = mongoose.Schema({
  email: String,
  password: String,
  admin: Boolean
});

//
// USER METHODS
//

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

//
// EXPORT USER MODEL
//
var User = mongoose.model('User', userSchema);
module.exports = User;
