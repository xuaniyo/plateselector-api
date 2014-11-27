var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RestaurantSchema   = new Schema({
	title: String,
	keywords:String,
	
	 pos:{                  //<INDEXED as 2d>
        lon: Number,
        lat: Number
    }
	
});

module.exports = mongoose.model('Posts', RestaurantSchema);