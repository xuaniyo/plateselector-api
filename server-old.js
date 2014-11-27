// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://user:Temporal1@ds051720.mongolab.com:51720/restaurantsdb'); // connect to our database
var Restaurant     = require('./app/models/restaurant');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// on routes that end in /restaurants
// ----------------------------------------------------
router.route('/restaurants')

	// create a restaurant (accessed at POST http://localhost:8080/api/restaurants)
	.post(function(req, res) {
		
		var restaurant = new Restaurant();		// create a new instance of the Restaurant model
		restaurant.name = req.body.name;  // set the Restaurant name (comes from the request)

		restaurant.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Restaurant created!' });
		});

		
	})

	// get all the restaurants (accessed at GET http://localhost:8080/api/restaurants)
	.get(function(req, res) {
		Restaurant.find(function(err, restaurants) {
			if (err)
				res.send(err);

			res.json(restaurants);
		});
	});

// on routes that end in /restaurants/:restaurant_id
// ----------------------------------------------------
router.route('/restaurants/:restaurant_id')

	// get the restaurant with that id
	.get(function(req, res) {
		Restaurant.findById(req.params.restaurant_id, function(err, restaurant) {
			if (err)
				res.send(err);
			res.json(restaurant);
		});
	})

	// update the restaurant with this id
	.put(function(req, res) {
		Restaurant.findById(req.params.restaurant_id, function(err, restaurant) {

			if (err)
				res.send(err);

			restaurant.name = req.body.name;
			restaurant.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Restaurant updated!' });
			});

		});
	})

	// delete the restaurant with this id
	.delete(function(req, res) {
		Restaurant.remove({
			_id: req.params.restaurant_id
		}, function(err, restaurant) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


router.route('/restaurants/title/:title')

	// get the restaurant with that id
	.get(function(req, res) {
		Restaurant.find({title:req.params.title}, function(err, restaurant) {
			if (err)
				res.send(err);
			res.json(restaurant);
		});
	});
	
	
//  near restaurant near?lat=45.5&lon=-82	
router.route('/restaurants/near/')

	// get the restaurant with that id
	.get(function(req, res) {
		console.log("we are in");
		//in production you would do some sanity checks on these values before parsing and handle the error if they don't parse
		//var lat = parseFloat(req.query.lat);
    //var lon = parseFloat(req.query.lon);
		

		
		Restaurant.geoNear([3.014846,41.988843], { maxDistance : 5, spherical : true }, function(err, results, stats) {
     console.log(results);
    });
		
	});	

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
