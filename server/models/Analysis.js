var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

//
// DEFINE ANALYSIS SCHEMA
//
var analysisSchema = mongoose.Schema({
  apts: [{
          aptName: String,
          aptType: String,
          size: Number,
          price: Number,
          built: String,
          url: String
        }],
  criteria: [],
  poi: []

});

//
// ANALYSIS METHODS
//
analysisSchema.methods.getOutput = function(input) {
    return 'hi' + input;
};

//
// EXPORT ANALYSIS MODEL
//
var Analysis = mongoose.model('Analysis', analysisSchema);
module.exports = Analysis;

