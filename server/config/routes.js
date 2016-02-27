var express          = require('express');
var app              = express();
var router           = new express.Router();
var jwt              = require('jsonwebtoken');
var config           = require('../config/config');
var cors             = require('cors')

// allow cross origin access
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//
// REQUIRE CONTROLLERS
//
var usersController  = require('../controllers/users');
var aptsController   = require('../controllers/apartments');
var yelpController   = require('../controllers/yelp');

//
// ROUTES
//

// test routes - will delete later
router.get('/', function(req, res) {
  res.send('Hello! This server is API driven!')
});
router.get('/api', function(req, res) {
  res.json({message: "Welcome to La's API"})
})

// apartments route
router.get('/apartments', aptsController.getApts)
router.post('/apartment/rating', yelpController.getAptRating)

// POI route
router.get('/poi', yelpController.getPOI)

// USER routes
router.post('/api/user/new', usersController.new)
// token authentication route
router.post('/api/user/authenticate', usersController.authenticate)
// route middleware to verify a token
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
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
})
// save listing
router.post('/api/user/listing/add', usersController.addListing)
// get listings
router.post('/api/user/listings', usersController.getListings)
// save analysis
router.post('/api/user/analysis/add', usersController.addAnalysis)
// get analyses
router.post('/api/user/analyses', usersController.getAnalyses)
// delete a listing
router.post('/api/user/listings/update', usersController.updateListings)


module.exports = router;
