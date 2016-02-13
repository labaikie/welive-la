var User             = require('../models/User');
var jwt              = require('jsonwebtoken');

module.exports = {

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
          // return info including token as JSOM
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
