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

	postMrsSearch: function(req, res) {
		var fields = req.body.fields;
		var search_data = req.body.search;
		var patient_id = search_data.patient_id;

		console.log(search_data);
		db.MedicalSummary.findAll({
			where: {Patient_Id: patient_id},
			attributes: fields,
			order: 'mrs_id DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result, "count": result.length});
		}).error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postFunctionalAssessmentSearch: function(req, res) {
		var fields = req.body.fields;
        var search_data = req.body.search;
        var patient_id = search_data.patient_id;

        console.log(search_data);
        db.HeaderFA.findAll({
            where: {PATIENT_ID: patient_id},
            attributes: fields,
            order: 'Creation_date DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result, "count": result.length});
        }).error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
	},

	postMedicalAssessmentSearch: function(req, res) {
		var fields = req.body.fields;
        var search_data = req.body.search;
        var patient_id = search_data.patient_id;

        console.log(search_data);
        db.docMA.findAll({
            where: {Patient_id: patient_id},
            attributes: fields,
            order: 'Creation_date DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result, "count": result.length});
        }).error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
	},

	postCategory2Search: function(req, res) {
        var fields = req.body.fields;
        var search_data = req.body.search;
        var patient_id = search_data.patient_id;

        console.log(search_data);
        db.Category2.findAll({
            where: {patient_id: patient_id},
            attributes: fields,
            order: 'cat_id DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result, "count": result.length});
        }).error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
    },

	postCategory3Search: function(req, res) {
        var fields = req.body.fields;
        var search_data = req.body.search;
        var patient_id = search_data.patient_id;

        console.log(search_data);
        db.Category3.findAll({
            where: {patient_id: patient_id},
            attributes: fields,
            order: 'cat_id DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result, "count": result.length});
        }).error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
    },

	postInstantDrugScreenSearch: function(req, res) {
		var fields = req.body.fields;
        var search_data = req.body.search;
        var patient_id = search_data.patient_id;

        console.log(search_data);
        db.HeadersIDS.findAll({
            where: {PATIENT_ID: patient_id},
            attributes: fields,
            order: 'Creation_date DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result, "count": result.length});
        }).error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
	},

	postForm18Search: function(req, res) {
		var fields = req.body.fields;
        var search_data = req.body.search;
        var patient_id = search_data.patient_id;

        console.log(search_data);
        db.Form18.findAll({
            where: {patient_id: patient_id},
            attributes: fields,
            order: 'GORGON_ID DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result, "count": result.length});
        }).error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
	},

	postAudiogram1Search: function(req, res) {
		var fields = req.body.fields;
        var search_data = req.body.search;
        var patient_id = search_data.patient_id;

        console.log(search_data);
        db.headersSACLN.findAll({
            where: [{patient_id: patient_id},{SA_ID:3}],
            attributes: fields,
            order: 'Creation_date DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result, "count": result.length});
        }).error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
	},

	postAudiogram2Search: function(req, res) {
		var fields = req.body.fields;
        var search_data = req.body.search;
        var patient_id = search_data.patient_id;

        console.log(search_data);
        db.headersSACLN.findAll({
            where: [{patient_id: patient_id},{SA_ID:6}],
            attributes: fields,
            order: 'Creation_date DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result, "count": result.length});
        }).error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
	},

	

	postMedicalHistorySearch: function(req, res) {
		var fields = req.body.fields;
        var search_data = req.body.search;
        var patient_id = search_data.patient_id;

        console.log(search_data);
        db.MedicalHistory.findAll({
            where: {patient_id: patient_id},
            attributes: fields,
            order: 'mh_id DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result, "count": result.length});
        }).error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
	},

	postCOESearch: function(req, res) {
		var fields = req.body.fields;
        var search_data = req.body.search;
        var patient_id = search_data.patient_id;

        console.log(search_data);
        db.COE.findAll({
            where: {PatientId: patient_id},
            attributes: fields,
            order: 'coe_id DESC'
        }).success(function(result){
            res.json({"status": "success", "list": result, "count": result.length});
        }).error(function(error){
            res.json(500, {"status": "error", "message": error});
        });
	},


}