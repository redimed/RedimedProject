var db = require('../models');

module.exports = {
	insertMeasure: function(req,res){
		var info = req.body.info;

		db.DeviceMeasure.create(info)
			.success(function(){
				res.json({status:'success'});
			})
			.error(function(err){
				res.json({status:'fail',error:err});
				console.log(err);
			})
	}
};