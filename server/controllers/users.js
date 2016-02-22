var User             = require('../models/User');
var jwt              = require('jsonwebtoken');
var config           = require('../config/config');

module.exports = {

  new : function(req, res) {
    var user = new User();
    user.email = req.body.user.email;
    user.password = user.generateHash(req.body.user.password);
    var validEmail = /\S+@\S+\.\S+/
    if(validEmail.test(user.email) && user.password) {
      user.save(function(err) {
        if(err) {
          res.send(err)
        } else {
          res.json({success: true, message: "signup successful"})
        }
      })
    } else {
      res.json({success: false, message: "signup unsuccessful: please check email and password"})
    }
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
            expiresIn: 3600 // expires in 1hr
          });
          // return info including token as JSON
          res.json({
            success: true,
            message: 'Token sent!',
            user: user,
            token: token
          });
        }
      }
    })
  },

  getListings: function(req, res) {
    User.findOne({email: req.body.email }, function(err, user) {
      if(!err) res.json(user.listings)
    })
  },

  addListing: function(req, res) {
    User.findOneAndUpdate({email: req.body.user.email}, {$addToSet: {listings: req.body.apt}},function(err, data) {
        if(!err) res.send(data)
    })
  },

  updateListings: function(req, res) {

  },

  addAnalysis: function(req, res) {
    User.findOneAndUpdate({email: req.body.user.email}, {$addToSet: {analyses: req.body.analysis}},function(err, data) {
        console.log('analysis saved');
        if(!err) res.send(data.analyses)
    })
  },

  getAnalyses: function(req, res) {
    User.findOne({email: req.body.email }, function(err, user) {
      if(!err) res.json(user.analyses)
    })
  }

}
