// server.js

// BASE SETUP
// ==============================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var port    = 	parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 3000;
var domain      = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";


// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose   = require('mongoose');
mongoose.connect('mongodb://user:Temporal1@ds051720.mongolab.com:51720/restaurantsdb'); // connect to our database
var Restaurant     = require('./app/models/restaurant');

// we'll create our routes here

// get an instance of router
var router = express.Router();



// route middleware that will happen on every request
router.use(function(req, res, next) {

	// log each request to the console
	console.log(req.method, req.url);

	// continue doing what we were doing and go to the route
	next();	
});

// ROUTES
// ==============================================




// home page route (http://localhost:8080)
router.get('/', function(req, res) {
	res.send('im the home page!');	
});

// about page route (http://localhost:8080/about)
router.get('/about', function(req, res) {
	res.send('im the about page!');	
});



//find restaurants by a keyword (http://localhost:3000/app/restaurants/find?keyword=morro&page=1&size=10)
router.route('/restaurants/find')
	.get(function(req, res) {
		 
		//in production you would do some sanity checks on these values 
    var keyWord = req.query.keyword;
    
    var size = req.query.size || 20;//default return 20 restaurants
    var page = req.query.page || 0;//default 0
    var skip = page > 0 ? ((page - 1) * size) : 0;
    
    
    page = parseInt(page);
    size = parseInt(size);
       
		 
		 Restaurant.find({'keywords': new RegExp(keyWord, "i")}).skip(skip).limit(size).exec(function(err, restaurants) {
			if (err)
				res.send(err);

      var r ={};
      r['count'] = restaurants.length;
      r['restaurants'] = restaurants;	

			res.json(r);
		});
		 
	});



//find restaurants near a certain user with lat and lon (/app/restaurants/near?lon=2.189884&lat=41.375198&distance=8&page=1&size=20)
router.route('/restaurants/near')
	.get(function(req, res) {
		 
    var size = req.query.size || 20;//default return 20 restaurants
    var page = req.query.page || 0;//default 0
    var skip = page > 0 ? ((page - 1) * size) : 0;
    
    
    page = parseInt(page);
    size = parseInt(size);
		
		// get the max distance or set it to 800 meters
    //var maxDistance = req.query.distance || 8;
    
    var maxDistance = 0.04; 
    
     // we need to convert the distance to radians
    // the raduis of Earth is approximately 6371 kilometers
    //maxDistance /= 6371;
    
    console.log("maxdistance--->"+maxDistance);
    
    // get coordinates [ <longitude> , <latitude> ]
    var coords = [];
    coords[0] = parseFloat(req.query.lon) || 0;
    coords[1] = parseFloat(req.query.lat) || 0; 
		
		  // find a location
    Restaurant.find({
      pos: {
        $near: coords,
        $maxDistance: maxDistance
      }
    }).skip(skip).limit(size).exec(function(err, restaurants) {
      if (err) {
        return res.json(500, err);
      }
      
      var r ={};
      r['count'] = restaurants.length;
      r['restaurants'] = restaurants;	

      res.json(200, r);
    });
		 
	});


router.route('/restaurants')
	.get(function(req, res) {
		Restaurant.find(function(err, restaurants) {
			if (err)
				res.send(err);
				
		  var r ={};
      r['count'] = restaurants.length;
      r['restaurants'] = restaurants;	
      

      console.log(restaurants.length)
			res.json(r);
		});
	});
	


	


// apply the routes to our application
app.use('/app', router);

// we'll create our routes here

// START THE SERVER
// ==============================================
app.listen(port,domain);
console.log('Magic happens on port ' + port);
console.log('Domain ' + domain);