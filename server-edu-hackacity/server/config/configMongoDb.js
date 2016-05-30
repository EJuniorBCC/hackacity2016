var mongoose = require('mongoose');


var init = mongoose.connect('mongodb://localhost/ondeestudardb',function(err,data){
	if(err){
		console.log('Erro ao conectar');
	}else{
		console.log('MongoDB conectado');
	}
});


module.exports = {

	init:init
};