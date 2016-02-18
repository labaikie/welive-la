var User             = require('../models/User');
var jwt              = require('jsonwebtoken');
var config           = require('../config/config')

module.exports = {

  new : function(req, res) {
    var user = new User();
    user.email = req.body.user.email;
    user.password = user.generateHash(req.body.user.password);
    user.save(function(err) {
      if(err) {
        res.send(err)
      } else {
        res.json({success: true, message: "signup successful"})
      }
    })
  },

  authenticate : function(req, res) {
    User.findOne({ email: req.body.user.email }, function (err, user) {
      if (err) throw err;
      if (!user) {
        res.json({success: false, message: "Authentication failed: no user"})
      } else if (user) {
        if (!user.validPassword(req.body.user.password)) {
            res.json({success: false, message: 'Authenticaton failed: wrong password'})
        } else { // create token
          var token = jwt.sign(user, config.secret, {
            expiresInMinutes: 1440 // expires in 24hrs
          });
          // return info including token as JSON
          res.json({
            success: true,
            message: 'Token sent!',
            token: token
          });
        }
      }
    })
  },

  getListings: function(req, res) {
    User.findOne({email: req.body.user.email }, function(err, user) {
      if(!err) res.json(user.listings)
    })
  },

  addListing: function(req, res) {
    User.findOneAndUpdate({email: req.body.user.email}, {$addToSet: {listings: req.body.apt}},function(err, data) {
        if(!err) res.json('success')
    })
  },

  updateListings: function(req, res) {

  },

  logout : function(req, res) {
    //destroy token???
  }

}
