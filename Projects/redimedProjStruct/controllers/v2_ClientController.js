var PatientModel = require('../v1_models/Cln_patients');
var db = require('../models');

var mdtFunction = require('../mdt-functions');

module.exports = {

	postAppointments: function(req, res) {
		var patient_id = req.body.patient_id;

		db.Patient.find({
			where: {Patient_id: patient_id},
			include: [
				{ model: db.Appointment , as: 'Appointments'}
			],
			attributes: ['Patient_id'],
			order: [ [ { model: db.Appointment, as: 'Appointments' }, 'FROM_TIME', 'DESC' ] ]
		}).success(function(data){
			if(!data) {
				res.json(500, {status: 'error', message: 'Cannot found Patient'});
				return;
			}
			res.json({status: 'success', data: data});
		}).error(function(error){
			res.json(500, {status: 'error', error: error});
		});
	},

	postRecallAppointments: function(req, res) {
    	var patient_id = req.body.patient_id;

    	var str_now = mdtFunction.toDateDatabase(new Date());
    	console.log(str_now)

    	db.ApptPatient.findAll({
			where: {Patient_id: patient_id},
			include: [
				{ 
					model: db.Appointment , as: 'Appointment',
					attributes: ['FROM_TIME'],
					include: [
						{ model: db.Department , as: 'Department', attributes: ['CLINICAL_DEPT_NAME'] },
						{ model: db.SysServices , as: 'Service', attributes: ['SERVICE_NAME'] },
						{ model: db.Doctor , as: 'Doctor', attributes: ['NAME'] },
					],
					where: {FROM_TIME: {gt: str_now}}
				}
			],
			// attributes: ['Patient_id'],
			order: [ [ { model: db.Appointment, as: 'Appointment' }, 'FROM_TIME', 'DESC' ] ]
		}).success(function(data){
			if(!data) {
				res.json(500, {status: 'error', message: 'Cannot found Patient'});
				return;
			}
			res.json({status: 'success', data: data});
		}).error(function(error){
			res.json(500, {status: 'error', error: error});
		});

    },

	postClaims: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
        var fields = req.body.fields;
		var search_data = req.body.search;
		var Patient_id = search_data.Patient_id;


		db.Claim.findAndCountAll({
			where: {
				Patient_id: Patient_id
			},
			offset: offset,
			limit: limit,
			attributes: fields
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postCompanies: function(req, res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;
		
		if(search_data) {
			PatientModel._callback.search = function(query_builder){				
				query_builder.join('patient_companies', null, 'cln_patients.Patient_id = patient_companies.patient_id');
				query_builder.join('companies', null, 'patient_companies.company_id = companies.id');
				query_builder.where('cln_patients.patient_id = ?' , search_data.Patient_id);
			};
		}
		
		var sql_count = PatientModel.sql_search_count();

		var query_data = PatientModel.query_search_data(limit, offset, fields);
		query_data.field('IF(cln_patients.company_id = patient_companies.company_id , \'active\', \'inactive\' )','active');
		query_data.order('active');
        var sql_data = query_data.toString(); // PatientModel.sql_search_data(limit, offset, fields);

		var k_sql = req.k_sql;
		var result = null;
		k_sql.exec(sql_data).then(function(data){
			result = data;
			return k_sql.exec_row(sql_count);
		}).then(function(row){
			res.json({list: result, count: row.count});
		}).catch(function(err){
			console.log(err);
		})
	},

	postUpdate: function(req, res) {
        var id = req.body.Patient_id;
        var post_data = req.body.data;
        if(!id || !post_data) {
            res.end();
            return; 
        }

        var sql = PatientModel.sql_update(id, post_data);
        var k_sql = res.locals.k_sql;


        db.sequelize.query(sql)
        .success(function(data){
        	var sql = PatientModel.sql_insert_patient_company(id, post_data.company_id);
        	db.sequelize.query(sql)
        	.success(function(data){
        		res.json({status: 'success'});
        	}).error(function(err){
	            res.json({status: 'error', error: err});
	        })
        }).error(function(err){
            res.json({status: 'error', error: err});
        })
    },

    /*
    *	NUM 
    */
	
	getNumCompanies: function(req, res) {
		var id = req.query.id;
		if(!id) {
			res.json(500, {status: 'error'});
			return;
		}

		var daoFactory =  db.sequelize.daoFactoryManager.getDAO('patient_companies', { attribute: 'name' });

		daoFactory.count({
			where: {
				patient_id: id, 
			}
		}).success(function(data){
			res.json({status: 'success', count: data});
		}) . error(function(error){
			res.json(500, {status: 'error', error: error});
		});
	},

	getNumClaims: function(req, res) {
		var id = req.query.id;
		if(!id) {
			res.json(500, {status: 'error'});
			return;
		}
		
		db.Claim.count({
			where: {
				Patient_id: id, 
			}
		}).success(function(data){
			res.json({status: 'success', count: data});
		}) . error(function(error){
			res.json(500, {status: 'error', error: error});
		});
	},

	getNumReferrals : function(req, res) {
    	var id = req.query.id;
		if(!id) {
			res.json(500, {status: 'error'});
			return;
		}
		db.Referral.count({
			where: {Patient_id: id}
		}).success(function(data){
			res.json({status: 'success', count: data});
		}) . error(function(error){
			res.json(500, {status: 'error', error: error});
		});
    },
	
	getNumOutsideReferrals : function(req, res) {
    	var id = req.query.id;
		if(!id) {
			res.json(500, {status: 'error'});
			return;
		}
		db.OutsideReferral.count({
			where: {patient_id: id}
		}).success(function(data){
			res.json({status: 'success', count: data});
		}) . error(function(error){
			res.json(500, {status: 'error', error: error});
		});
    },

	getNumScripts : function(req, res) {
    	var id = req.query.id;
		if(!id) {
			res.json(500, {status: 'error'});
			return;
		}
		db.Script.count({
			where: {patient_id: id}
		}).success(function(data){
			res.json({status: 'success', count: data});
		}) . error(function(error){
			res.json(500, {status: 'error', error: error});
		});
    },
	
}