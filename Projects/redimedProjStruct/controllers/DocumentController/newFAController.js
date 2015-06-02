var db = require("../../models");
var knex = require("../../knex-connect.js");
var moment = require('moment');
var extend = require('util')._extend;


module.exports = {
	newHeaderAndSections: function(req,res){
		var getResult = {};
		var headerId = req.body.fa_id;
		//get header
		knex
		.select()
		.from('sys_fa_df_headers')
		.where({FA_ID: headerId})
		.then(function(headerRes){
			if(headerRes.length===0) res.json(500,{status:'get header error'});
			else{
				getResult = headerRes[0];
				//get sections
				knex
				.select()
				.from('sys_fa_df_sections')
				.where({FA_ID: headerId})
				.orderBy('ORD')
				.then(function(sectionRes){
					getResult.sections = sectionRes;
					res.json({status:'success', data:getResult});
				})
				.error(function(err){
					res.json(500,{status:'error'}) 
				})
			}
		})
		.error(function(err){
			res.json(500,{status:'error'})
		})
	},

	newLines: function(req,res){
		var sectionId = req.body.section_id;
		var headerId = req.body.fa_id;
		//get lines
		knex
		.select()
		.from('sys_fa_df_lines')
		.where({
			SECTION_ID: sectionId,
			FA_ID: headerId
		})
		.orderBy('ORD')
		.then(function(lineRes){
			res.json({status:'success',data: lineRes});
		})
		.error(function(err){
			res.json(500,{status:'error'});
		})

	},

	newDetailsAndComments: function(req,res){
		var lineId = req.body.line_id;
		//get details
		knex
		.select()
		.from('sys_fa_df_line_details')
		.where({LINE_ID: lineId})
		.orderBy('ORD')
		.then(function(detailRes){
			//get comments
			knex
			.select()
			.from('sys_fa_df_comments')
			.where({LINE_ID: lineId})
			.then(function(commentRes){
				console.log('those are comments', commentRes)
				res.json({
					status: 'success',
					data:{
						details: detailRes,
						comments: commentRes
					}
				})
			})
			.error(function(err){
				res.json(500, {status:'error'})
			})
		})
		.error(function(err){
			res.json(500,{status:'error'})
		})
	},

	autoRating: function(req,res){
		var patient_age = req.body.patient_age;
		var patient_gender = req.body.patient_gender;
		var valueToRate = req.body.valueToRate;
		var rating_id = req.body.rating_id;

		knex.raw("select `RATE`, `VALUE` from `sys_rankings` where `HEADER_ID` = ? and ? between `FROM_AGE` and `TO_AGE` and `GENDER` like ? and ? between `FROM_VALUE` and `TO_VALUE`",[rating_id, patient_age, patient_gender,valueToRate])
		.then(function(result){
			console.log('this is result.length', result);
			if(result[0].length===0){
				res.json({status:'unrated'});
			}
			else res.json({status:'success', data:result[0]});
		})
		.error(function(err){
			res.json({status:'error'});
		})
	}
}