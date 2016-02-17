var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

//
// DEFINE LISTING SCHEMA
//
var listingSchema = new Schema(
  user: String,
  listing: {
              name: String,
              type: String,
              size: Number,
              price: Number,
              built: String,
              url: String
            }
);

//
// LISTING METHODS
//
listingSchema.methods.getOutput = function(input) {
    return 'hi' + input;
};

//
// EXPORT LISTING MODEL
//
module.exports = mongoose.model('Listing', listingSchema);

