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
	},
	editMeasure: function(req,res){
		var info = req.body.info;
		var id = req.body.id;

		db.DeviceMeasure.update(info,{measure_id:id})
			.success(function(){
				res.json({status:'success'});
			})
			.error(function(err){
				res.json({status:'fail',error:err});
				console.log(err);
			})
	},
	getData: function(req,res){
		var id = req.body.id;
		
		if(req.body.patient_id == null || typeof req.body.patient_id === 'undefined')
		{
			db.sequelize.query("SELECT m.*, d.device_name, CONCAT(IFNULL(p.Title,''), ' . ', IFNULL(p.`First_name`,''),' ',IFNULL(p.`Sur_name`,''),' ',IFNULL(p.`Middle_name`,'')) as FullName "+
							 	"FROM cln_device_measures m "+
							 	"INNER JOIN cln_patients p ON p.Patient_id = m.patient_id "+
							 	"INNER JOIN medical_device d ON m.device_id = d.id "+
							 	"WHERE m.device_id = ? "+
								"ORDER BY m.measure_date DESC",null,{raw:true},[id])
			.success(function(data){
				res.json({status:'success',data:data})
			})
			.error(function(err){
				res.json({status:'fail',error:err});
				console.log(err);
			})
		}
		else
		{
			var patient_id = req.body.patient_id;

			db.sequelize.query("SELECT m.*,d.device_name, CONCAT(IFNULL(p.Title,''), ' . ', IFNULL(p.`First_name`,''),' ',IFNULL(p.`Sur_name`,''),' ',IFNULL(p.`Middle_name`,'')) as FullName "+
							 	"FROM cln_device_measures m "+
							 	"INNER JOIN cln_patients p ON p.Patient_id = m.patient_id "+
							 	"INNER JOIN medical_device d ON m.device_id = d.id "+
							 	"WHERE m.device_id = ? AND m.patient_id = ? "+
								"ORDER BY m.measure_date DESC",null,{raw:true},[id,patient_id])
				.success(function(data){
					res.json({status:'success',data:data})
				})
				.error(function(err){
					res.json({status:'fail',error:err});
					console.log(err);
				})

		}

		
	}
};