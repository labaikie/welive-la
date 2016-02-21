var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var bcrypt        = require('bcrypt');

//
// DEFINE USER SCHEMA
//
var userSchema = new Schema({
  email: { type: String, required: true, index: {unique: true}},
  password: { type: String, required: true },
  listings: [],
  analyses: []
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
module.exports = mongoose.model('User', userSchema);
