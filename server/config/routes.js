var express          = require('express')
var router           = new express.Router();

//
// REQUIRE CONTROLLERS
//
var usersController  = require('../controllers/users');
var aptsController   = require('../controllers/apartments');
var poiController    = require('../controllers/poi')

//
// ROUTES
//

// test routes - will delete later
router.get('/', function(req, res) {
  res.send('Hello! This server is API driven!');
});
router.get('/api', function(req, res) {
  res.json({message: "Welcome to La's API"})
})

// apartments route
router.get('/apartments', aptsController.getApts)

// POI route
router.get('/poi', poiController.getPOI)

// token authentication route
router.post('api/user/login', usersController.authenticate);

// route middleware to verify a token
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token throw error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

module.exports = router;
