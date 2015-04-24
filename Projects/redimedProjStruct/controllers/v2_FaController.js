var db = require("../models");
var knex = require("../knex-connect.js");
var moment = require('moment');

module.exports = {
	postSearch: function(req,res){
		var postData = req.body;

		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;

        var searchData = req.body.search;

        var whereClause = {
        	FA_NAME: '',
        	TYPE: ''
        }
        if(searchData.FA_NAME) whereClause.FA_NAME = "%"+searchData.FA_NAME+"%";
        if(searchData.TYPE) whereClause.TYPE = "%"+searchData.TYPE+"%"

		var sql = knex
		.select('FA_ID','FA_NAME','TYPE','Creation_date')
		.from('sys_fa_df_headers')
		.where('FA_NAME','like','%'+whereClause.FA_NAME+'%')
		.andWhere('TYPE','like','%'+whereClause.TYPE+'%')
		.orderBy('FA_ID','desc')
		.limit(limit)
		.offset(offset)
		.toString();

		var sql2 = knex("sys_fa_df_headers")
		.count("FA_ID as count")
		.where('FA_NAME','like','%'+whereClause.FA_NAME+'%')
		.andWhere('TYPE','like','%'+whereClause.TYPE+'%')
		.toString();

		db.sequelize.query(sql)
		.success(function(result){
			db.sequelize.query(sql2)
			.success(function(result2){
				res.json({status: "success", count: result2[0].count, list: result});
			})
			.error(function(err){
				res.json(500, {"status": "error", "message": err});
			})
		})
		.error(function(err){
			res.json(500, {"status": "error", "message": err});
		})
	},

	postInsertHeader: function(req,res){
		knex.transaction(function(trx){
			knex('sys_fa_df_headers')
			.insert(
				{FA_ID:27}
			)
			.transacting(trx)
			.then(function(res1){
				return knex('sys_fa_df_headers')
				.insert([
					{FA_ID:28},
					{FA_ID:29},
					{FA_ID:30}
				])
				.transacting(trx)
				.then(function(res2){
					console.log("this is res 2",res2);
				})
			})
			.then(trx.commit)
			.catch(trx.rollback);
		})
		.then(function(inserts){
			console.log(inserts.length + ' new records saved.');
			res.end();
		})
		.catch(function(error){
			console.log("no record saved due to an unexpected error");
			res.end();
		})
	}
}