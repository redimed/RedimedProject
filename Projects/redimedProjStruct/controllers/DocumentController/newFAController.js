var db = require("../../models");
var knex = require("../../knex-connect.js");
var moment = require('moment');
var extend = require('util')._extend;
var Promise = require('promise')

module.exports = {
	// newHeaderAndSections: get new header and section layout from "sys_fa" 
	// input: functional assessment header id
	// output: header and all the sections of that header
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
				//get section
				knex
				.select()
				.from('sys_fa_df_sections')
				.where({FA_ID: headerId})
				.orderBy('ORD')
				.then(function(sectionRes){
					getResult.sections = sectionRes;
					//return header and all the sections to client
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
		if(rating_id === 16 || rating_id === 17){
			knex.raw("select `RATE`, `VALUE`, `FROM_VALUE`, `TO_VALUE` from `sys_rankings` where `HEADER_ID` = ? and ? between `FROM_AGE` and `TO_AGE` and `GENDER` like ?",[rating_id, patient_age, patient_gender])
			.then(function(result){
				if(result[0].length===0){
					res.json({status:'unrated'});
				}
				else res.json({status:'success', data:result[0]});
			})
			.error(function(err){
				res.json({status:'error'});
			})
		}
		else{
			knex.raw("select `RATE`, `VALUE` from `sys_rankings` where `HEADER_ID` = ? and ? between `FROM_AGE` and `TO_AGE` and `GENDER` like ? and ? between `FROM_VALUE` and `TO_VALUE`",[rating_id, patient_age, patient_gender,valueToRate])
			.then(function(result){
				if(result[0].length===0){
					res.json({status:'unrated'});
				}
				else res.json({status:'success', data:result[0]});
			})
			.error(function(err){
				res.json({status:'error'});
			})
		}	
	},

	checkExistFA: function(req,res){
		var headerId = req.body.fa_id;
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;

		knex
		.select()
		.from('cln_fa_df_headers')
		.where({FA_ID: headerId, PATIENT_ID:patient_id, CAL_ID:cal_id})
		.then(function(result){
			if(result.length===0) res.json({status:'not existed'});
			else res.json({status:'existed'});
		})
		.error(function(err){
			res.json(500,{status:'error'})
		})
	},

	existHeaderAndSections: function(req,res){
		var getResult = {};
		var headerId = req.body.fa_id;
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;
		knex
		.select()
		.from('cln_fa_df_headers')
		.where({FA_ID: headerId, PATIENT_ID: patient_id, CAL_ID:cal_id})
		.then(function(headerRes){
			if(headerRes.length===0) res.json(500,{status:'get header error'});
			else{
				getResult = headerRes[0];
				knex
				.select()
				.from('cln_fa_df_sections')
				.where({FA_ID: headerId, PATIENT_ID: patient_id, CAL_ID:cal_id})
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

	existLines: function(req,res){
		var sectionId = req.body.section_id;
		var headerId = req.body.fa_id;
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;
		//get lines
		knex
		.select()
		.from('cln_fa_df_lines')
		.where({
			SECTION_ID: sectionId,
			FA_ID: headerId,
			PATIENT_ID: patient_id,
			CAL_ID:cal_id
		})
		.orderBy('ORD')
		.then(function(lineRes){
			res.json({status:'success',data: lineRes});
		})
		.error(function(err){
			res.json(500,{status:'error'});
		})

	},

	existDetailsAndComments: function(req,res){
		var lineId = req.body.line_id;
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;
		//get details
		knex
		.select()
		.from('cln_fa_df_line_details')
		.where({LINE_ID: lineId, PATIENT_ID: patient_id, CAL_ID:cal_id})
		.orderBy('ORD')
		.then(function(detailRes){
			//get comments
			knex
			.select()
			.from('cln_fa_df_comments')
			.where({LINE_ID: lineId, PATIENT_ID: patient_id, CAL_ID:cal_id})
			.then(function(commentRes){
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

	insertNewFA: function(req,res){
		var insertHeader = req.body.insertData.insertHeader;
		var insertSections = req.body.insertData.insertSections;
		var insertLines = req.body.insertData.insertLines;
		var insertDetails = req.body.insertData.insertDetails;
		var insertComments = req.body.insertData.insertComments;

		knex.transaction(function(trx){
			return trx
			.insert(insertHeader)
			.into('cln_fa_df_headers')
			.then(function(res1){
				return trx
				.insert(insertSections)
				.into('cln_fa_df_sections')
				.then(function(res2){
					return trx
					.insert(insertLines)
					.into('cln_fa_df_lines')
					.then(function(res3){
						return trx
						.insert(insertDetails)
						.into('cln_fa_df_line_details')
						.then(function(res4){
							return trx
							.insert(insertComments)
							.into('cln_fa_df_comments')
						})
					})
				})
			})
		})
		.then(function(result){
			res.json({status:'success'});
		})
		.error(function(err,sqldata){
			res.json(500, {status:'error', error:err, sql:sqldata});
		})
	},

	updateNewFA: function(req,res){
		var updateHeader = req.body.updateData.insertHeader;
		var updateSections = req.body.updateData.insertSections;
		var updateLines = req.body.updateData.insertLines;
		var updateDetails = req.body.updateData.insertDetails;
		var updateComments = req.body.updateData.insertComments;
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;

		var updateNewHeader = function(){
			knex('cln_fa_df_headers')
			.update(updateHeader)
			.where({PATIENT_ID:patient_id, CAL_ID: cal_id, FA_ID:updateHeader.FA_ID})
			.then(function(headerRes){
				updateNewSections().then(function(sectionRes){
					if(sectionRes.status==='success') res.json({status:'success'});
					else res.json(500,{status:'error'})
				})
			})
			.error(function(err){
				res.json(500,{status:'error', error: err})
			})
		}

		var updateNewSections = function(){
			return new Promise(function(resolve,reject){
				updateSections.forEach(function(updateSection){
					knex('cln_fa_df_sections')
					.update(updateSection)
					.where({PATIENT_ID:patient_id, CAL_ID: cal_id, SECTION_ID: updateSection.SECTION_ID})
					.then(function(sectionRes){
						if(updateSections.indexOf(updateSection) === updateSections.length-1){
							updateNewLines().then(function(lineRes){
								if(lineRes.status==='success') resolve({status:'success'});
								else resolve({status:'error'});
							})
						}
					})
					.error(function(err){
						resolve({status:'error' , error: err});
					})
				})
			})
		}

		var updateNewLines = function(){
			return new Promise(function(resolve,reject){
				updateLines.forEach(function(updateLine){
					knex('cln_fa_df_lines')
					.update(updateLine)
					.where({PATIENT_ID:patient_id, CAL_ID: cal_id, LINE_ID: updateLine.LINE_ID})
					.then(function(lineRes){
						if(updateLines.indexOf(updateLine) === updateLines.length-1){
							updateNewDetail().then(function(detailRes){
								if(detailRes.status==='success') resolve({status:'success'});
								else resolve({status:'error'});
							})
						}
					})
					.error(function(err){
						resolve({status:'error' , error: err});
					})
				})
			})
		}

		var updateNewDetail = function(){
			return new Promise(function(resolve,reject){
				updateDetails.forEach(function(updateDetail){
					knex('cln_fa_df_line_details')
					.update(updateDetail)
					.where({PATIENT_ID:patient_id, CAL_ID: cal_id, DETAIL_ID: updateDetail.DETAIL_ID})
					.then(function(detailRes){
						if(updateDetails.indexOf(updateDetail) === updateDetails.length-1){
							updateNewComment().then(function(commentRes){
								if(commentRes.status==='success') resolve({status:'success'});
								else resolve({status:'error'});
							})
						}
					})
					.error(function(err){
						resolve({status:'error', error: err});
					})
				})
			})
		}

		var updateNewComment = function(){
			return new Promise(function(resolve,reject){
				updateComments.forEach(function(updateComment){
					knex('cln_fa_df_comments')
					.update(updateComment)
					.where({PATIENT_ID:patient_id, CAL_ID: cal_id, FA_COMMENT_ID: updateComment.FA_COMMENT_ID})
					.then(function(commentRes){
						if(updateComments.indexOf(updateComment) === updateComments.length-1){
							resolve({status:'success'});
						}
					})
					.error(function(err){
						resolve({status:'error' , error: err});
					})
				})
			})
		}

		updateNewHeader();
	},

	getDoctor: function(req,res){
		var user_id = req.body.user_id;

		knex.raw("select user.`Booking_Person`, doc.* from `users` user inner join `doctors` doc on doc.`User_id` = user.`id` where user.`id` = ?",[user_id])
		.then(function(result){
			if(result.length === 0) res.json({status:"no doctor"});
			else res.json({status:'success', data:result[0]});
		})
		.error(function(err){
			res.json(500,{status:'error'})
		})
	}
}