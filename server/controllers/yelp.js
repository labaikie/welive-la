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
    var location = req.query.location
    var query = req.query.query
    yelp.search({term: query, location: location, limit: 10})
      .then(function(data) {
        res.json(data.businesses);
      })
      .catch(function(err) {
        res.json(err)
      })
  },

  getAptRating: function(req, res, next) {
    var apt = req.body.apt;
    // apt = apt.toLowerCase().replace(/ /g, '-')
    yelp.search({term: apt + ' apartment', location: 'los-angeles', limit: 1})
      .then(function(data) {
        console.log(data.businesses);
        if(data.businesses) res.json(data.businesses[0].rating);
      })
      .catch(function(err) {
        console.log('getting error', err)
        res.json(err)
      })
  }

}
