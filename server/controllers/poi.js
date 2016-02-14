var Yelp          = require('yelp');
var rp            = require('request-promise');

module.exports = {

  getPOI: function(req, res, next) {
    res.json('Yelp POI')
  }

}
