var db = require('../models');

module.exports = {
	getPatientProblem: function(req,res){
		var patientId = req.body.patient_id;

		db.ClnPatientProblem.findAll({where:{patient_id: patientId}})
			.success(function(data){
				res.json({status:'success',data: data});
			})
			.error(function(err){
				res.json({status:'error'});
				console.log(err);
			})
	}
}