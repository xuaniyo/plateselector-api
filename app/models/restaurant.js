var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RestaurantSchema   = new Schema({
	title: String,
	keywords:String,
	ficha:String,
	tipo:String,
	direccion:String,
	telefono:String,
	horario:String,
	postid:String,
	content:String,
	thumbnail:String,
  
  pos: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
  }
	
});

module.exports = mongoose.model('Posts', RestaurantSchema);