var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var S = require('string');
var db = require('../models');
var _ = require('lodash');

module.exports = {

	// <summary>
	// getdoctorid: Get list all appoinment ( cal_id) a specific table
	// Input param: cal_id
	// Output param: Get all data from table cln_appointment_calendar
	// </summary>
	getdoctorid : function(req,res){
		
		var postData = req.body.data;

		// Get data an according to cal_id from table cln_appointment_calendar
		var sql = knex
			.column('*')
			.from('cln_appointment_calendar')
			.where('cal_id',postData.cal_id)
			.toString();
		
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data,  sql: sql});
		})
		.error(function(error){
			res.json(500, {error: error});	
		})

	},

	deleteMedication : function(req,res){
		var postData = req.body.data;
		var sql = knex
			.column('*')
			.from('cln_appointment_calendar')
			.where('cal_id',postData.cal_id)
			.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data,  sql: sql});
		})
		.error(function(error){
			res.json(500, {error: error});	
		})
	},
	insertMedication: function(req, res){
		var postData = req.body.data;
		var sql = knex
			.column('*')
			.from('cln_patient_consults')
			.where('patient_id',postData.patient_id)
			.where('cal_id',postData.cal_id)
			.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data,  sql: sql});
		})
		.error(function(error){
			res.json(500, {error: error});	
		})
	},
	getMedication: function(req, res){
		var postData = req.body.data;

		var sql = knex
			.column('cln_patient_medication_details.*','cln_patient_consults.cal_id','cln_appointment_calendar.FROM_TIME','doctors.NAME','doctors.Provider_no')
			.from('cln_patient_medication_details')
			.innerJoin('cln_patient_consults', 'cln_patient_medication_details.consult_id', 'cln_patient_consults.consult_id')
			.innerJoin('cln_appointment_calendar', 'cln_patient_consults.cal_id', 'cln_appointment_calendar.CAL_ID')
			.leftOuterJoin('doctors', 'cln_patient_medication_details.doctor_id', 'doctors.doctor_id')
			.where('cln_patient_medication_details.patient_id',postData.patient_id)
			.limit(postData.limit)
			.offset(postData.offset)
			.toString();
				
		var count_sql = knex('cln_patient_medication_details')
			.count('cln_patient_medication_details.id as a')
			.toString();
		db.sequelize.query(sql)
		.success(function(rows){
			db.sequelize.query(count_sql)
			.success(function(count){
				res.json({data: rows, count: count[0].a, sql: sql});
			})
			.error(function(error){
				res.json(500, {error: error});	
			})
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},
	// <summary>
	// postListPatient: Get list of all alerts(Patient_id, CAL_ID) a specific Patient
	// Input param: Patient_id, CAL_ID, limit, offset
	// Output param: data from table cln_patient_alerts and patient_companies
	// </summary>
	postListPatient: function(req, res) {

		var postData = req.body.data;

		// Get data from table cln_patient_alerts and join to table patient_companies
		// via patient_id and eligibility according to CAL_ID, Patient_id with table cln_patient_alerts

		var sql = knex('cln_patient_alerts')
		.where({
			'cln_patient_alerts.patient_id': postData.Patient_id,
			'cln_patient_alerts.cal_id': postData.CAL_ID
		})
		.innerJoin('patient_companies', 'cln_patient_alerts.patient_id', 'patient_companies.patient_id')
		
		.limit(postData.limit)
		.offset(postData.offset)
		.orderBy('cln_alerts.id', 'desc')

	},
	
	/* 
		<summary>
			postListNoFollowPatient: Get list of alert (Patient_id) a specific table
			Input param: Patient_id, name, description
			Output param: id, name, description, Creation_date
		</sumamry>
	*/
	postListNoFollowPatient: function(req, res){
		var postData = req.body.data;

		// select all alerts with paging
		var sql = knex('cln_alerts')
			.distinct(
				'cln_alerts.id',
				knex.raw('IFNULL(name,\'\') AS name'),
				knex.raw('IFNULL(description,\'\') AS description'),
				'cln_alerts.Creation_date'
			)
			.whereNotExists(function(){
				this.select('*').from('cln_patient_alerts')
				.whereRaw('cln_alerts.id = cln_patient_alerts.alert_id')
				.where('cln_patient_alerts.patient_id', postData.Patient_id)
			})
			.where('cln_alerts.isenable', 1)
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
			.limit(postData.limit)
			.offset(postData.offset)
			.orderBy('cln_alerts.Creation_date', postData.Creation_date)
			.toString();

		var count_sql = knex('cln_alerts')
			.count('cln_alerts.id as a')
			.whereNotExists(function(){
				this.select('*').from('cln_patient_alerts')
				.whereRaw('cln_alerts.id = cln_patient_alerts.alert_id')
				.where('cln_patient_alerts.patient_id', postData.Patient_id)
			})
			.where('cln_alerts.isenable', 1)
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
			.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			db.sequelize.query(count_sql)
			.success(function(count){
				res.json({data: rows, count: count[0].a, sql: sql});
			})
			.error(function(error){
				res.json(500, {error: error});
			})
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	/* 
		<summary>
			postListFollowPatient: Get list of all alerts (description,name) of a specific Patient  
			Input param: Patient_id, order, name, description
			Ouput param: id, name, description, Creation_date
		</summary>
	*/
	postListFollowPatient: function(req, res){
		var postData = req.body.data;

		//		Get data from table cln_alerts via join to table cln_patient_alerts
		//		and search an infomartion data about name, description

		// select all alerts with paging
		var sql = knex('cln_alerts')
			.distinct(
				'cln_alerts.id',
				knex.raw('IFNULL(name,\'\') AS name'),
				knex.raw('IFNULL(description,\'\') AS description'),
				'cln_alerts.Creation_date'
			)
			.innerJoin('cln_patient_alerts', 'cln_alerts.id', 'cln_patient_alerts.alert_id')
			.where('cln_patient_alerts.patient_id', postData.Patient_id)
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
			.limit(postData.limit)
			.offset(postData.offset)
			.orderBy('cln_alerts.Creation_date', postData.Creation_date)
			.toString();

		// Count number of all alert without paging
		var count_sql = knex('cln_alerts')
			.count('cln_alerts.id as a')
			.innerJoin('cln_patient_alerts', 'cln_alerts.id', 'cln_patient_alerts.alert_id')
			.where('cln_patient_alerts.patient_id', postData.Patient_id)
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
			.toString();


		db.sequelize.query(sql)
		.success(function(rows){
			db.sequelize.query(count_sql)
			.success(function(count){
				res.json({data: rows, count: count[0].a});
			})
			.error(function(error){
				res.json(500, {error: error});
			})
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	// <summary>
	// postEdit: update data for a specific alert
	// Input param: alert data, alert id 
	// Output param: return a sql query
	// </summary>
	postEdit: function(req, res){
		var postData = req.body.data;

		var errors = [];
		var required = [
			{field: 'name', message: 'Alert Name required'},
			{field: 'description', message: 'Description required'},
			{field: 'SERVICE_COLOR', message: 'Service color required'}
		]

		// validate alert data
		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}

		var unique_sql = knex('cln_alerts')
			.whereNotIn('id', [postData.id])
			.where('name', postData.name)
			.toString();

		var sql = knex('cln_alerts')
			.where('id', postData.id)
			.update(postData)
			.toString();

		db.sequelize.query(unique_sql)
		.success(function(rows){
			if(rows.length > 0){
				errors.push({field: 'name', message: 'Alert Name exists'});
				res.status(500).json({errors: errors});
				return;
			}else{
				db.sequelize.query(sql)
				.success(function(updated){
					res.json({data: updated});	
				})
				.error(function(error){
					res.json(500, {error: error});
				})
			}
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	// <summary>
	// postOne: Get list of all alert(id)
	// Input param: id
	// Output param: return one row data 
	// </summary>
	postOne: function(req, res){
		var postData = req.body.data;

		// Get data from table cln_alerts and eligibility according to id and isenable
		var sql = knex('cln_alerts')
			.column('*')
			.where('cln_alerts.isenable', 1)
			.where('id', postData.id)
			.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows[0]});
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	// <summary>
	// postRemove: Delete data of alert
	// Input param: id
	// Output param: return a sql query 
	// </summary>
	postRemove: function(req, res){
		var postData = req.body.data;

		var sub_sql = knex('cln_patient_alerts')
			.where('alert_id', postData.id)
			.del()
			.toString();

		db.sequelize.query(sub_sql)
		.success(function(del){
			res.json({data: del});
		})
		.error(function(error){
			res.json(500, {error: error});
		})

	},

	// <summary>
	// postAdd: Create new data
	// Input param: alert data
	// Output param: return a queries
	// </summary>
	postAdd: function(req, res){
		
		var postData = req.body.data;

		var errors = [];
		
		var required = [
			{field: 'name', message: 'Alert Name required'},
			{field: 'description', message: 'Description required'},
			{field: 'SERVICE_COLOR', message: 'Service color required'}
		]

		// Validate data
		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}

		var unique_sql = knex('cln_alerts')
			.where('name', postData.name)
			.toString();

		if(postData.company_id === 'undefined') {
			postData.company_id = 0;
		}

		var sql = knex('cln_alerts')
			.insert({
				Created_by: postData.Created_by,
				Last_updated_by: postData.Last_updated_by,
				Last_update_date: postData.Last_update_date,
				Creation_date: postData.Creation_date,
				company_id: postData.company_id,
				SERVICE_COLOR: postData.SERVICE_COLOR,
				description: postData.description,
				name: postData.name
			})
			.toString();

		db.sequelize.query(unique_sql)
		.success(function(rows){
			if(rows.length > 0){
			
				errors.push({field: 'name', message: 'Alert Name exists'});
				res.status(500).json({errors: errors});
				return;
			
			}else{
				db.sequelize.query(sql)
				.success(function(data){
					var sql_id = knex('cln_alerts')
						.max('id as id')
						.toString();

					db.sequelize.query(sql_id)
					.success(function(f){
						
						var sql_k = knex('cln_patient_alerts')
							.insert({
								alert_id: f[0].id,
								patient_id: postData.patient_id,
								cal_id: postData.cal_id
							})
							.toString();
						
						db.sequelize.query(sql_k)
						.success(function(data_k){
							res.json({data: data_k});
						})
						.error(function(error){
							res.json(500, {error: error});
						})
					})
					.error(function(error){
						res.json(500, {error: error});
					})
				})
				.error(function(error){
					res.json(500, {error: error});
				})
			}
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},


	// <summary>
	// postList: Get list of all alert
	// Input param: alert data
	// Output param: id, name, description, SERVICE_COLOR, Creation_date, isenable
	// </summary>
	postList: function(req, res){
		var postData = req.body.data;

		// Get data and paging
		var sql = knex
			.column(
				'id',
				knex.raw('IFNULL(name,\'\') AS name'),
				knex.raw('IFNULL(description,\'\') AS description'),
				'SERVICE_COLOR',
				'Creation_date',
				'isenable'
			)
			.from('cln_alerts')
			.where({
				'company_id': 0
			})
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
			.orderBy('Creation_date', postData.Creation_date)
			.limit(postData.limit)
			.offset(postData.offset)
			.toString();

		// Count data
		var count_sql = knex('cln_alerts')
			.count('id as a')
			.where(knex.raw('IFNULL(name,\'\') LIKE \'%'+postData.name+'%\''))
			.where(knex.raw('IFNULL(description,\'\') LIKE \'%'+postData.description+'%\''))
			.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			db.sequelize.query(count_sql)
			.success(function(count){
				res.json({data: rows, count: count[0].a, sql: sql});
			})
			.error(function(error){
				res.json(500, {error: error});	
			})
		})
		.error(function(error){
			res.json(500, {error: error});
		})
	},

	// <summary>
	// postUpdateEnable: Processing an enable and disable
	// Input param: isenable
	// Output param: return a sql query
	// </summary>
	postUpdateEnable : function(req,res){
		
		var postData = req.body.data;
        
        if (postData.isenable == 1) {
            postData.isenable = 0;
        } else{
            postData.isenable = 1;
        }

        var sql = knex('cln_alerts')
            .update({
                'isenable': postData.isenable
            })
            .where('id',postData.id)
            .toString()
        
        db.sequelize.query(sql)
        .success(function(data){
            res.json({data: data,sql:sql});
        })
        .error(function(error){
            res.json(500, {error: error,sql:sql});
        }) 

	},
	postUpdateEnablePatient : function(req,res){
		
		var postData = req.body.data;
        
        if (postData.isEnable == 1) {
            postData.isEnable = 0;
        } else{
            postData.isEnable = 1;
        }
        
        var sql = knex('cln_patient_alerts')
            .update({
                'isEnable': postData.isEnable
            })
            .where('alert_id',postData.alert_id)
            .where('patient_id',postData.patient_id)
            .where('cal_id',postData.cal_id)
            .toString()
            
        db.sequelize.query(sql)
        .success(function(data){
            res.json({data: data,sql:sql});
        })
        .error(function(error){
            res.json(500, {error: error,sql:sql});
        })

	},

	// <summary>
	// postSelectAlert: Get company_id from table cln_patients and according to Patient_id
	// Input param: Patient_id
	// Output param: company_id
	// </summary>
	postSelectAlert: function(req, res) {

		var postData = req.body.data;

		var sql = knex('cln_patients')
			.column('company_id')
			.where({
				'Patient_id': postData
			})
			.toString();

		db.sequelize.query(sql)
		.success(function(data){
            res.json({data: data});
        })
        .error(function(error){
            res.json(500, {error: error,sql:sql});
        })

	},

	// <summary>
	// postInsertAlert: Insert data into table cln_patient_alerts
	// Input param: alert data
	// Output param: return a sql query
	// </summary>
	postInsertAlert: function(req, res){

		var postData = req.body.data;

		var sr = {
			p: 0,
			c: 0
		}

		_.forEach(postData, function(values, indexs) {
			sr.p = postData[indexs].patient_id;
			sr.c = postData[indexs].cal_id;
		})

		var sql_check = knex('cln_patient_alerts')
			.where({
				patient_id: sr.p,
				cal_id: sr.c
			})
			.toString();

		db.sequelize.query(sql_check)
		.success(function(data){

			var new_array = [];

            _.forEach(postData, function(value, index) {
            	var flag = true;
            	_.forEach(data, function(value_s, index_s) {
            		if(data[index_s].alert_id == postData[index].alert_id) {
            			flag = false;
            			return;
            		}
            	})
            	if(flag)
            		new_array.push(value);
			})

        	var sql = knex('cln_patient_alerts')
				.insert(new_array)
				.toString();

			db.sequelize.query(sql)
			.success(function(data){
	            res.json({data: data});
	        })
	        .error(function(error){
	            res.json(500, {error: error,sql:sql});
	        })

        })
        .error(function(error){
            res.json(500, {error: error,sql:sql});
        })
		
	},

	// <summar>
	// postShowAlertPatient: Get list all patient alert(patient_id, cal_id) a specific table
	// and eligibility according to patient_id, cal_id
	// Input param: patient data
	// Output param: count, data from table cln_patient_alerts with table cln_alerts
	// </summary> 
	postShowAlertPatient: function(req, res) {

		var postData = req.body.data;

		//Get data from table cln_patient_alerts and join to table cln_alerts
		var sql = knex('cln_patient_alerts')
			.where({
				'cln_patient_alerts.patient_id': postData.patient_id,
				'cln_patient_alerts.cal_id': postData.cal_id
			})
			.innerJoin('cln_alerts', 'cln_patient_alerts.alert_id', 'cln_alerts.id')
			.limit(postData.limit)
			.offset(postData.offset)
			.orderBy('cln_patient_alerts.id', 'desc')
			.toString();

		var sql_count = knex('cln_patient_alerts')
			.count('cln_alerts.id as a')
			.where({
				'cln_patient_alerts.patient_id': postData.patient_id,
				'cln_patient_alerts.cal_id': postData.cal_id
			})
			.innerJoin('cln_alerts', 'cln_patient_alerts.alert_id', 'cln_alerts.id')
			.toString();

		db.sequelize.query(sql)
		.success(function(data){
			db.sequelize.query(sql_count)
			.success(function(count){
        		res.json({data: data, count: count[0].a});
        	})
        	.error(function(error){
	            res.json(500, {error: error,sql:sql});
	        })
        })
        .error(function(error){
            res.json(500, {error: error,sql:sql});
        })
        
	},
	// <summary>
	// postListAlert: Get list all alert(company_id) s specific table
	// Input param: company_id, limit, offset
	// Output param: count, id, name, description, isenable
	// </summnary>
	postListAlert: function(req, res) {

		var postData = req.body.data;
		// Get data from table cln_alerts and eligibility according to isenable and company_id
		var sql = knex('cln_alerts')
			.where({
				'isenable': 1,
				'company_id': postData.company_id
			})
			.orWhere({
				'company_id': 0
			})
			.limit(postData.limit)
			.offset(postData.offset)
			.orderBy('id', 'desc')
			.toString();

		var sql_count = knex('cln_alerts')
			.count('id as a')
			.where({
				'isenable': 1,
				'company_id': postData.company_id
			})
			.orWhere({
				'company_id': 0
			})
			.toString();

		db.sequelize.query(sql)
		.success(function(data){
            db.sequelize.query(sql_count)
            .success(function(count){
            	res.json({data: data, count: count[0].a});
            })	
            .error(function(error){
            	res.json(500, {error: error,sql:sql});
        	})
    	})
        .error(function(error){
            res.json(500, {error: error,sql:sql});
        })

	}

}