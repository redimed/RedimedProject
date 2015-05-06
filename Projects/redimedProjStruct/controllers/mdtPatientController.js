var db = require('../models');
var mdt_functions = require('../mdt-functions.js');
var knex = require('../knex-connect.js');


module.exports = {
	postAdd: function(req, res){
		var postData = req.body;

		db.Patient.create(postData)
		.success(function(created){
			if(!created){
				res.json(500, {"status": "error", "message": "Database Error"});
			}else{
				db.Patient.find({
					order: "Patient_id DESC" 
				})
				.success(function(patient){
					if(typeof postData.CAL_ID !== 'undefined'){
						var sql = knex('cln_appt_patients')
								.insert({
									Patient_id: patient.Patient_id,
									CAL_ID: postData.CAL_ID
								})
								.toString();
						db.sequelize.query(sql)
						.success(function(inserted){
							res.json({"status": "success", "data": patient});
						})
						.error(function(error){
							res.json(500, {"status": "error", "message": error});				
						})

					}else
						res.json({"status": "success", "data": patient});
				})
			}
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},
	postEdit: function(req, res){
		//POST DUA VAO
		var patient_id = req.body.Patient_id;
		delete req.body.Patient_id;
		var postData = req.body;
		console.log(postData);
		//COMPANY CASE
		var sql_company = "";
		if(postData.company_id !== null){
			sql_company = "INSERT IGNORE INTO patient_companies(patient_id, company_id) VALUES('"+patient_id+"', '"+postData.company_id+"')";
		}
		//END COMPANY CASE

		if(patient_id == null)
		{
			console.log("============================",patient_id);
			res.json(500, {"status": "error"});
			return;
			
		}

		db.Patient.find({ where: {Patient_id: patient_id} })
		.success(function(patient){
			if(!patient)
			{
				res.json(500, {"status": "error"});
				return;
			}
			patient.updateAttributes(postData)
			.success(function(updated){
				if(sql_company !== ''){
					db.sequelize.query(sql_company)
					.success(function(created){
						res.json({"status": "success", "data": updated});
					})
					.error(function(error){
						res.json(500, {"status": "error", "message": error});			
					})
				}//end if sql company
				else{
					res.json({"status": "success", "data": updated});
				}
			})
			.error(function(err)
			{
				res.json({"status": "error", "error": err});
				console.log(err)
			});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
			console.log(error);
		})
		//END POST
	},
	postById: function(req, res){
		// POST
		var Patient_id = req.body.Patient_id;
		// END POST

		db.Patient.find(Patient_id)
		.success(function(patient){
			if(!patient){
				res.json(500, {"status": "error", "message": "Database Error"});
			}else{
                if(!!patient.company_id){
                        patient.getCompany().then(function(company){
                        console.log("this is company", company);
                        if(!!company.Insurer){
                            var insurer_sql = "SELECT id, insurer_name FROM cln_insurers WHERE id="+company.Insurer;

                            db.sequelize.query(insurer_sql)
                            .success(function(list){
                                res.json({"status": "success", "company": company, "data": patient, "insurer": list[0]});
                            })
                            .error(function(error){
                                res.json({"status": "error", "message": error});
                            })
                        }else{
                            res.json({"status": "success", "company": company, "data": patient, "insurer": null});
                        }
                    }, function(error){
                        res.json(500, {"status": "error", "message": error});
                    })
                }
                else{
                    res.json({"status": "success", "company": null, "data": patient, "insurer": null})
                }
				
			}
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},
	postSearch: function(req, res){
		//POST DUA VAO
		var pagination = req.body.pagination;
		var post_fields = req.body.filters;
		var select = req.body.select;
		//END POST DUA VAO

		var sql = "";
		sql = mdt_functions.commonSearch(post_fields);

		db.Patient
		.findAndCountAll({
			where: [sql],
			offset: pagination.offset,
			limit: pagination.limit,
			attributes: select,
			order: 'Creation_date DESC'
		})
		.success(function(result){
			if(!result){
				res.json({"status": "error", "message": "Database Error"});
			}else{
				res.json({"status": "success", "data": result.rows, "count": result.count});
			}
		})
		.error(function(error){
			res.json({"status": "error", "message": "Internal Server Error"});
		})
	},// end post search
	getDropdown: function(req, res){
		db.Patient
		.findAndCountAll({
			where: {Isenable: 1},
			attributes: ['Patient_id', 'First_name', 'Sur_name']
		})
		.success(function(result){
			if(!result){
				res.json(500, {"status": "error", "message": "Database Error"});
			}else{
				res.json({"status": "success", "data": result.rows, "count": result.count});
			}
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
	}
}