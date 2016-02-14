var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

//
// DEFINE LISTING SCHEMA
//
var listingSchema = mongoose.Schema({
  aptName: String,
  aptType: String,
  size: Number,
  price: Number,
  built: String,
  url: String
});

//
// LISTING METHODS
//
listingSchema.methods.getOutput = function(input) {
    return 'hi' + input;
};

//
// EXPORT LISTING MODEL
//
var Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;

