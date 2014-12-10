var db = require('../models');
var item_fees_model = require('../v1_models/Cln_item_fees.js');
var fund_fees_model = require('../v1_models/Cln_item_health_fund_fees.js');
var fee_types_model = require('../v1_models/Cln_fee_types.js');
var funds_model = require('../v1_models/Cln_private_fund.js');

module.exports = {
	postGetItemFundFees: function(req, res) {
		var search = req.body.search;
		var item_id = search.item_id; 
		var fields = req.body.fields;
		// var item_id = req.query.id;

		if(!item_id){
			res.json(500, {"status": "error"});
			return;
		}

		var sql = funds_model.sql_item_health_fund_fees(item_id, fields);

		db.sequelize.query(sql)
        .success(function(data){
            res.json({status:'success', list:data});
        })
        .error(function(err){
            res.json({status:'error', err:err});
        });
	},

	postInsertItemFundFees: function(req, res) {
		var item_id = req.body.item_id; 
		var fees = req.body.fees; 

		if(!item_id || !fees || fees.length === 0){
			res.json(500, {"status": "error"});
			return;
		}

		var sql = fund_fees_model.sql_insert_item_fees(item_id, fees);

	  	db.sequelize.query(sql)
        .success(function(data){
            res.json({status:'success', result:data});
        })
        .error(function(err){
            res.json({status:'error', err:err});
        });
	},

	/*
	*	ITEM FEE TYPES
	*/

	postGetItemFees: function(req, res) {
		var search = req.body.search;
		var item_id = search.item_id; 
		var fields = req.body.fields;

		if(!item_id){
			res.json(500, {"status": "error"});
			return;
		}
		var sql = fee_types_model.sql_item_fees(item_id, fields);

		db.sequelize.query(sql)
        .success(function(data){
            res.json({status:'success', list:data});
        })
        .error(function(err){
            res.json({status:'error', err:err});
        });
	},

	// getGetItemFees: function(req, res) {
	// 	var item_id = req.query.item_id; 
	// 	if(!item_id){
	// 		res.json(500, {"status": "error"});
	// 		return;
	// 	}
	// 	db.mdtClnItemFee.findAll({
	// 		where: {CLN_ITEM_ID: item_id}
	// 	})
	// 	.success(function(data){
	// 		res.json({"status": "success", "list": data});
	// 	})
	// 	.error(function(error){
	// 		res.json(500, {"status": "error", "message": error});
	// 	});
	// },

	postInsertItemFees: function(req, res) {
		var item_id = req.body.item_id; 
		var fees = req.body.fees; 

		if(!item_id || !fees || fees.length === 0){
			res.json(500, {"status": "error"});
			return;
		}

		var sql = item_fees_model.sql_insert_item_fees(item_id, fees);

	  	db.sequelize.query(sql)
        .success(function(data){
            res.json({status:'success', result:data});
        })
        .error(function(err){
            res.json({status:'error', err:err});
        });
	},
}