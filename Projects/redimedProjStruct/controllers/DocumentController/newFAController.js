var db = require("../../models");
var knex = require("../../knex-connect.js");
var moment = require('moment');
var extend = require('util')._extend;
var Promise = require('promise')

module.exports = {
	// newHeaderAndSections: get new header and section layout from "sys_fa_df" 
	// input: header_id
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

	// newLines: get new lines layout of the specific section from "sys_fa_df" 
	// input: header_id, section_id
	// output: every lines have matching section_id and header_id
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
			//return the lines
			res.json({status:'success',data: lineRes});
		})
		.error(function(err){
			res.json(500,{status:'error'});
		})

	},

	// newDetailsAndComments: get new details and comments layout of specific line from "sys_fa_df" 
	// input: line_id
	// output: every details and comments have matching section_id
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

				//return details and comments result
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

	// autoRating: rate the tests in each functional assessment automatically
	// input: patient_age, patient_gender, valueToRate, rating_id (id of rating standard)
	// output: the rating result (contain score and ranking)
	autoRating: function(req,res){
		var patient_age = req.body.patient_age;
		var patient_gender = req.body.patient_gender;
		var valueToRate = req.body.valueToRate;
		var rating_id = req.body.rating_id;

		//check if the rating depend on valueToRate or not
		if(rating_id === 16 || rating_id === 17){

			//get rating result
			knex.raw("select `RATE`, `VALUE`, `FROM_VALUE`, `TO_VALUE` from `sys_rankings` where `HEADER_ID` = ? and ? between `FROM_AGE` and `TO_AGE` and `GENDER` like ?",[rating_id, patient_age, patient_gender])
			.then(function(result){

				//check if there is no rating result
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


	// checkExistFA: to check if that functional assessment is already available for that appoinment or not.
	// input: header_id, patient_id, cal_id
	// output: status "existed" or "not existed"

	//WARNING: this will decide the mode of the client form (add or edit) to call the suitable functions after.
	checkExistFA: function(req,res){
		var headerId = req.body.fa_id;
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;
		//do the cheking query
		knex
		.select()
		.from('cln_fa_df_headers')
		.where({FA_ID: headerId, PATIENT_ID:patient_id, CAL_ID:cal_id})
		.then(function(result){

			//check number of result rows to return correct message to client
			if(result.length===0) res.json({status:'not existed'});
			else res.json({status:'existed'});
		})
		.error(function(err){
			res.json(500,{status:'error'})
		})
	},

	// existHeaderAndSections: get existed header and section from "cln_fa_df" 
	// input: header_id
	// output: header and all the sections of that header
	existHeaderAndSections: function(req,res){
		var result = {};
		var headerId = req.body.fa_id;
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;

		//get header
		knex
		.select()
		.from('cln_fa_df_headers')
		.where({FA_ID: headerId, PATIENT_ID: patient_id, CAL_ID:cal_id})
		.then(function(headerRes){
			if(headerRes.length===0) res.json(500,{status:'get header error'});
			else{
				result = headerRes[0];
				//get header
				knex
				.select()
				.from('cln_fa_df_sections')
				.where({FA_ID: headerId, PATIENT_ID: patient_id, CAL_ID:cal_id})
				.orderBy('ORD')
				.then(function(sectionRes){
					result.sections = sectionRes;
					//return header and section result
					res.json({status:'success', data:result});
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

	// existHeaderAndSections: get existed lines of specific section from "cln_fa_df" 
	// input: header_id, sections
	// output: every lines have matching section_id and header_id
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
			//return the lines to client
			res.json({status:'success',data: lineRes});
		})
		.error(function(err){
			res.json(500,{status:'error'});
		})

	},

	// existHeaderAndSections: get existed details and comments of specific line from "cln_fa_df" 
	// input: line_id
	// output: every lines have matching section_id and header_id
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


	// insertNewFA: insert new functional assessment record to "cln_fa_df" 
	// input: infoHeader, infoSections, infoLines, infoDetails, infoComments (populated on client)
	// output: insert status result: success or not.
	insertNewFA: function(req,res){
		var insertHeader = req.body.insertData.infoHeader;
		var insertSections = req.body.insertData.infoSections;
		var insertLines = req.body.insertData.infoLines;
		var insertDetails = req.body.insertData.infoDetails;
		var insertComments = req.body.insertData.infoComments;

		//create a transaction for batch inserts operation
		knex.transaction(function(trx){
			return trx
			.insert(insertHeader)
			.into('cln_fa_df_headers')
			.then(function(headerRes){
				return trx
				.insert(insertSections)
				.into('cln_fa_df_sections')
				.then(function(sectionRes){
					return trx
					.insert(insertLines)
					.into('cln_fa_df_lines')
					.then(function(lineRes){
						return trx
						.insert(insertDetails)
						.into('cln_fa_df_line_details')
						.then(function(detailsRes){
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

	//updateFA: update existed functional assessment in "cln_fa_df"
	//input: infoHeader, infoSections, infoLines, infoDetails, infoComments (populated on client)
	//output: update status result: success or not
	updateFA: function(req,res){
		var updateHeader = req.body.updateData.infoHeader;
		var updateSections = req.body.updateData.infoSections;
		var updateLines = req.body.updateData.infoLines;
		var updateDetails = req.body.updateData.infoDetails;
		var updateComments = req.body.updateData.infoComments;
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;

		//The following 5 functions is chained with each other:
		//updateHeader<-->updateSections<-->updateLines<-->updateDetails<-->updateComments
		//
		//WARNING: the later 4 functions is promises which mean they must wait each other finished proccessing to continue operating
		var updateHeader = function(){
			knex('cln_fa_df_headers')
			.update(updateHeader)
			.where({PATIENT_ID:patient_id, CAL_ID: cal_id, FA_ID:updateHeader.FA_ID})
			.then(function(headerRes){
				//Call next function on the chain.
				updateSections().then(function(sectionRes){
					//check the last resolve to return the correct result to client
					if(sectionRes.status==='success') res.json({status:'success'});
					else res.json(500,{status:'error'})
				})
			})
			.error(function(err){
				res.json(500,{status:'error', error: err})
			})
		}

		var updateSections = function(){
			return new Promise(function(resolve,reject){
				updateSections.forEach(function(updateSection){
					knex('cln_fa_df_sections')
					.update(updateSection)
					.where({PATIENT_ID:patient_id, CAL_ID: cal_id, SECTION_ID: updateSection.SECTION_ID})
					.then(function(sectionRes){
						if(updateSections.indexOf(updateSection) === updateSections.length-1){
							//Call next function on the chain.
							updateLines().then(function(lineRes){
								//resolve to the function which call it in the chain
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

		var updateLines = function(){
			return new Promise(function(resolve,reject){
				updateLines.forEach(function(updateLine){
					knex('cln_fa_df_lines')
					.update(updateLine)
					.where({PATIENT_ID:patient_id, CAL_ID: cal_id, LINE_ID: updateLine.LINE_ID})
					.then(function(lineRes){
						if(updateLines.indexOf(updateLine) === updateLines.length-1){
							//Call next function on the chain.
							updateDetails().then(function(detailRes){
								//resolve to the function which call it in the chain
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

		var updateDetails = function(){
			return new Promise(function(resolve,reject){
				updateDetails.forEach(function(updateDetail){
					knex('cln_fa_df_line_details')
					.update(updateDetail)
					.where({PATIENT_ID:patient_id, CAL_ID: cal_id, DETAIL_ID: updateDetail.DETAIL_ID})
					.then(function(detailRes){
						if(updateDetails.indexOf(updateDetail) === updateDetails.length-1){
							//Call next function on the chain.
							updateComments().then(function(commentRes){
								//resolve to the function which call it in the chain
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

		var updateComments = function(){
			return new Promise(function(resolve,reject){
				updateComments.forEach(function(updateComment){
					knex('cln_fa_df_comments')
					.update(updateComment)
					.where({PATIENT_ID:patient_id, CAL_ID: cal_id, FA_COMMENT_ID: updateComment.FA_COMMENT_ID})
					.then(function(commentRes){
						if(updateComments.indexOf(updateComment) === updateComments.length-1){
							//resolve to the function which call it in the chain
							resolve({status:'success'});
						}
					})
					.error(function(err){
						resolve({status:'error' , error: err});
					})
				})
			})
		}

		//Call the first function in the chain
		updateNewHeader();
	},

	// getDoctor: get informations of doctor participate in this functional assessment.
	// input: insertHeader, insertSections, insertLines, insertDetailsm insertComments (populated on client)
	// output: insert status result: success or not.
	getDoctor: function(req,res){
		var user_id = req.body.user_id;

		//get doctor by join those table:
		//users
		//doctors
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