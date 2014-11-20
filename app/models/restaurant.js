var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RestaurantSchema   = new Schema({
	title: String,
	keywords:String
});

module.exports = mongoose.model('Posts', RestaurantSchema);