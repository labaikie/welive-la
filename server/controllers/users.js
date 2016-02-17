var User             = require('../models/User');
var jwt              = require('jsonwebtoken');

module.exports = {

  new : function(req, res) {
    var user = new User({
      email: req.body.email,
      password: req.body.password
    })
    user.save() // revise to add if success, fail, response
  }

  authenticate : function(req, res) {
    User.findOne({ name: req.body.email }, function (err, user) {
      if (err) throw err;
      if (!user) {
        res.json({success: false, message: "Authentication failed: no user"})
      } else if (user) {
        if (user.password != req.body.password) {
            res.json({success: false, message: 'Authenticaton failed: wrong password'})
        } else { // create token
          var token = jwt.sign(user, app.get('superSecret'), {
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
  }

}
