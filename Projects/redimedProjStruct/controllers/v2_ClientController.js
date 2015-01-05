var PatientModel = require('../v1_models/Cln_patients');
var db = require('../models');

module.exports = {
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

        k_sql.exec(sql, function (data) {
        	if(!post_data.company_id) {
        		res.json({status: 'success'});
        		return;
        	}
        	var sql = PatientModel.sql_insert_patient_company(id, post_data.company_id);
        	k_sql.exec(sql, function (data) {
        		res.json({status: 'success'});
        	}, function(err) {
		   // DUPLICATE PRIMARY KEY of patient companies
	            res.json({status: 'success'});
	        });
        }, function(err) {
            res.json({status: 'error'});
        });
    },
	
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