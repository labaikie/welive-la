var Yelp          = require('yelp');
var rp            = require('request-promise');
var config        = require('../config/config');

var yelp = new Yelp({
  consumer_key: config.yelp_key,
  consumer_secret: config.yelp_secret,
  token: config.yelp_token,
  token_secret: config.yelp_token_secret
});

module.exports = {

  getPOI: function(req, res, next) {
    var location = "Echo Park, Los Angeles, CA"
    var query = "Grocery"
    yelp.search({term: query, location: location, limit: 10})
      .then(function(data) {
        res.json(data.businesses);
      })
      .catch(function(err) {
        res.json(err)
      })
  },

  getAptRating: function(req, res, next) {
    var apt = 'Mediterranean Village West Hollywood'
    apt = apt.toLowerCase().replace(/ /g, '-')
    yelp.business(apt)
      .then(function(data) {
        if(data) res.json(data);
      })
      .catch(function(err) {
        res.json(err)
      })
  }

}
