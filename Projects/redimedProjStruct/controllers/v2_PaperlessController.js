var db = require('../models');

module.exports = {

	postGorgonMaSearch: function(req, res) {
		var fields = req.body.fields;
		var search_data = req.body.search;
		var patient_id = search_data.patient_id;

		console.log(search_data);

		db.gorgonMA.findAll({
			where: {PATIENT_ID: patient_id},
			attributes: fields,
			order: 'GORGON_ID DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result, "count": result.length});
		}).error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postGorgonFaSearch: function(req, res) {
		var fields = req.body.fields;
		var search_data = req.body.search;
		var patient_id = search_data.patient_id;

		console.log(search_data);
		db.gorgonFA.findAll({
			where: {patientId: patient_id},
			attributes: fields,
			order: 'id DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result, "count": result.length});
		}).error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postGorgonUqSearch: function(req, res) {
		var fields = req.body.fields;
		var search_data = req.body.search;
		var patient_id = search_data.patient_id;

		console.log(search_data);
		db.gorgonUQ.findAll({
			where: {Patient_Id: patient_id},
			attributes: fields,
			order: 'Quest_Id DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result, "count": result.length});
		}).error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postGorgonMhSearch: function(req, res) {
		var fields = req.body.fields;
		var search_data = req.body.search;
		var patient_id = search_data.patient_id;

		console.log(search_data);
		db.gorgonMH.findAll({
			where: {Patient_Id: patient_id},
			attributes: fields,
			order: 'Gorgon_Id DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result, "count": result.length});
		}).error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postMedicalResultSummarySearch: function(req, res) {

	},

	postFunctionalAssessmentSearch: function(req, res) {

	},

	postMedicalAssessmentSearch: function(req, res) {

	},

	postCategory2Search: function(req, res) {

	},

	postCategory3Search: function(req, res) {

	},

	postInstantDrugScreenSearch: function(req, res) {

	},

	postForm18Search: function(req, res) {

	},

	postAudiogram1Search: function(req, res) {

	},

	postAudiogram2Search: function(req, res) {

	},

	

	postMedicalHistorySearch: function(req, res) {

	},

	postCOESearch: function(req, res) {

	},


}