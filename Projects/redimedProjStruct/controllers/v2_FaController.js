var db = require("../models");
var knex = require("../knex-connect.js");
var moment = require('moment');
var extend = require('util')._extend;

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

	// postInsertHeader: function(req,res){
	// 	knex.transaction(function(trx){
	// 		knex('sys_fa_df_headers')
	// 		.insert(
	// 			{FA_ID:27}
	// 		)
	// 		.transacting(trx)
	// 		.then(function(res1){
	// 			return knex('sys_fa_df_headers')
	// 			.insert([
	// 				{FA_ID:28},
	// 				{FA_ID:29},
	// 				{FA_ID:30}
	// 			])
	// 			.transacting(trx)
	// 			.then(function(res2){
	// 				console.log("this is res 2",res2);
	// 			})
	// 		})
	// 		.then(trx.commit)
	// 		.catch(trx.rollback);
	// 	})
	// 	.then(function(inserts){
	// 		console.log(inserts.length + ' new records saved.');
	// 		res.end();
	// 	})
	// 	.catch(function(error){
	// 		console.log("no record saved due to an unexpected error");
	// 		res.end();
	// 	})
	// }

	postInsert: function(req,res){
		knex.transaction(function(trx){
			var header = req.body;
			var insertHeader = extend({},req.body);
			delete insertHeader.sections;
			//insert header
			knex('sys_fa_df_headers')
			.insert(insertHeader)
			.transacting(trx)
			.then(function(headerResult){
				var headerId = headerResult[0];
				//sections config
				var sections = header.sections;
				sections.forEach(function(section){
					var insertSection = extend({},section);
					delete insertSection.lines;
					insertSection.FA_ID = headerId;
					//insert section
					return knex('sys_fa_df_sections')
					.insert(insertSection)
					.transacting(trx)
					.then(function(sectionResult){
						var sectionId = sectionResult[0];
						//lines config
						var lines = section.lines;
						lines.forEach(function(line){
							var insertLine = extend({},line);
							delete insertLine.details;
							delete insertLine.comments;
							insertLine.SECTION_ID = sectionId;
							insertLine.FA_ID = headerId;
							//insert line
							return knex('sys_fa_df_lines')
							.insert(insertLine)
							.transacting(trx)
							.then(function(lineResult){
								var lineId = lineResult[0];
								//detail and comment config
								var details = line.details;
								var comments = line.comments;
								for(var i = 0; i<details.length; i++){
									details[i].LINE_ID = lineId;
									if(i===details.length-1){
										//insert detail
										return knex('sys_fa_df_line_details')
										.insert(details)
										
										.then(function(detailsResult){
											if(!comments || comments.length === 0){
												if(!detailsResult){
													res.json(500,{status:'error'});
												}
												else res.json({status: 'success'});
											}
											else{
												for(var j=0; j<comments.length; j++){
													comments[j].LINE_ID = lineId;
													if(j===comments.length-1){
														return knex('sys_fa_df_comments')
														.insert(comments)
														
														.then(function(commentResult){
															if(!commentResult){
																res.json(500,{status:'error'});
															}
															else res.json({status: 'success'});
														})
													}
												}
											}	
										})
									}
								}

							})
						})
					})
				})
			})
			.then(trx.commit)
			.catch(trx.rollback);
		})
		.then(function(insertResult){
			res.json({status:'success'});
		})
		.catch(function(error){
			console.log("insert failed due to unexpected error", error);
			res.json(500,{status:'error'});
		})
	},


	postDelete: function(req,res){
		var deleteHeaderId = req.body.id;
		//remove header
		knex('sys_fa_df_headers')
		.where('FA_ID', deleteHeaderId)
		.del()
		.then(function(delHeaderRes){
			//remove section
			knex('sys_fa_df_sections')
			.where('FA_ID', deleteHeaderId)
			.del()
			.then(function(delSectionRes){
				//get list id of line
				knex
				.select('LINE_ID')
				.from('sys_fa_df_lines')
				.where('FA_ID', deleteHeaderId)
				.then(function(selectLineRes){
					var lineIDList = [];
					selectLineRes.forEach(function(line){
						lineIDList.push(line.LINE_ID);
						if(selectLineRes.indexOf(line) === selectLineRes.length - 1){
							//remove lines
							knex('sys_fa_df_lines')
							.where('FA_ID', deleteHeaderId)
							.del()
							.then(function(deleteLineRes){
								//remove detail
								knex('sys_fa_df_line_details')
								.whereIn('LINE_ID', lineIDList)
								.del()
								.then(function(delDetailRes){
									//remove comments
									knex('sys_fa_df_comments')
									.whereIn('LINE_ID', lineIDList)
									.del()
									.then(function(delCommentsRes){
										res.json({status:'success'})
									})
									.catch(function(error){
										res.json(500,{status:'error', message:error});
									})
								})
								.catch(function(error){
									res.json(500,{status:'error', message:error});
								})
							})
							.catch(function(error){
								res.json(500,{status:'error', message:error});
							})
						}
					})
							
				})
				.catch(function(error){
					res.json(500,{status:'error', message:error});
				})
			})
			.catch(function(error){
				res.json(500,{status:'error', message:error});
			})
		})
		.catch(function(error){
			res.json(500,{status:'error', message:error});
		})
	},

	// postGet: function(req,res){
	// 	var getResult = {};
	// 	var headerId = req.body.id;
	// 	//get header
	// 	knex
	// 	.select()
	// 	.from('sys_fa_df_headers')
	// 	.where({FA_ID: headerId})
	// 	.then(function(getHeaderRes){
	// 		getResult = getHeaderRes[0];
	// 		//get sections of header
	// 		knex
	// 		.select()
	// 		.from('sys_fa_df_sections')
	// 		.where({FA_ID: headerId})
	// 		.orderBy('ORD')
	// 		.then(function(getSectionsRes){
	// 			if(getSectionsRes.length===0){
	// 				res.json(500,{status: 'failed'}) 
	// 			}
	// 			else{
	// 				getResult.sections = getSectionsRes;
	// 				getResult.sections.forEach(function(section){
	// 					//get lines in sections
	// 					knex
	// 					.select()
	// 					.from('sys_fa_df_lines')
	// 					.where({
	// 						SECTION_ID: section.SECTION_ID,
	// 						FA_ID: headerId
	// 					})
	// 					.orderBy('ORD')
	// 					.then(function(getLinesRes){
	// 							if(getLinesRes.length>0){
	// 								section.lines = getLinesRes;
	// 								section.lines.forEach(function(line, index){
	// 								//get line details
	// 									knex
	// 									.select()
	// 									.from('sys_fa_df_line_details')
	// 									.where({LINE_ID: line.LINE_ID})
	// 									.orderBy('ORD')
	// 									.then(function(getDetailsRes){
	// 										line.details = getDetailsRes;
	// 										//get line comment
	// 										knex
	// 										.select()
	// 										.from('sys_fa_df_comments')
	// 										.where({LINE_ID: line.LINE_ID})
	// 										.then(function(getCommentsRes){
	// 											line.comments = getCommentsRes;
	// 											if(getSectionsRes.indexOf(section)===getSectionsRes.length-1 && getLinesRes.indexOf(line)===getLinesRes.length-1){
	// 												res.json({status:'success',data:getResult});
	// 											}
	// 										})
	// 										.error(function(err){
	// 											res.json(500, {status: 'failed', error: err})
	// 										})
	// 									})
	// 									.error(function(err){
	// 										res.json(500, {status: 'failed', error: err})
	// 									})
	// 								})
	// 							}
	// 							// else{
	// 							// 	res.json
	// 							// }

	// 					})
						
	// 					.error(function(err){
	// 						res.json(500, {status: 'failed', error: err})
	// 					})
	// 				})
	// 			}
	// 		})
	// 		.error(function(err){
	// 			res.json(500, {status: 'failed', error: err})
	// 		})
	// 	})
	// 	.error(function(err){
	// 		res.json(500, {status: 'failed', error: err})
	// 	})
	// }

	postGetHeaderAndSections: function(req,res){
		var getResult = {};
		var headerId = req.body.id;
		//get header
		knex
		.select()
		.from('sys_fa_df_headers')
		.where({FA_ID: headerId})
		.then(function(headerRes){
			if(headerRes.length===0) res.json(500,{status:'get header error', error:err});
			else{
				getResult = headerRes[0];
				//get sections
				knex
				.select()
				.from('sys_fa_df_sections')
				.where({FA_ID: headerId})
				.orderBy('ORD', 'desc')
				.then(function(sectionRes){
					if(sectionRes.length===0) res.json(500,{status:'get sections error', error:err});
					else{
						getResult.sections = sectionRes;
						res.json({status:'success', data:getResult});
					}
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

	postGetLines: function(req,res){
		var sectionId = req.body.sectionId;
		var headerId = req.body.headerId;
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

	postGetDetailsAndComments: function(req,res){
		var lineId = req.body.lineId;
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
						commments: commentRes
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

	}

	// postGet: function(req,res){
	// 	var getResult = {};
	// 	var headerId = req.body.id;

	// 	//get header
	// 	knex
	// 	.select()
	// 	.from('sys_fa_df_headers')
	// 	.where({FA_ID: headerId})
	// 	.then(function(headerRes){
	// 		if(headerRes.length===0) res.json(500,{status:'get header error', error:err});
	// 		else {
	// 			getResult = headerRes[0];
	// 			//get sections
	// 			knex
	// 			.select()
	// 			.from('sys_fa_df_sections')
	// 			.where({FA_ID: headerId})
	// 			.orderBy('ORD', 'desc')
	// 			.then(function(sectionRes){
	// 				if(sectionRes.length===0) res.json(500,{status:'get section error', error:err});
	// 				else{
	// 					getResult.sections=sectionRes;
	// 					getResult.sections.forEach(function(section){
	// 						//get lines
	// 						knex
	// 						.select()
	// 						.from('sys_fa_df_lines')
	// 						.where({
	// 							SECTION_ID: section.SECTION_ID,
	// 							FA_ID: headerId
	// 						})
	// 						.orderBy('ORD')
	// 						.then(function(lineRes){
	// 							if(lineRes.length===0){
	// 								if(getResult.sections.indexOf(section) === getResult.sections.length - 1)
	// 									res.json({status:'success',data: getResult});
	// 							}
	// 							else{
	// 								section.lines = lineRes;
	// 								section.lines.forEach(function(line){
	// 									//get detail
	// 									knex
	// 									.select()
	// 									.from('sys_fa_df_line_details')
	// 									.where({LINE_ID: line.LINE_ID})
	// 									.orderBy('ORD')
	// 									.then(function(detailRes){
	// 										line.details = detailRes;
	// 										//get comment
	// 										knex
	// 										.select()
	// 										.from('sys_fa_df_comments')
	// 										.where({LINE_ID: line.LINE_ID})
	// 										.then(function(commentRes){
	// 											line.comment = commentRes;
	// 											if(getResult.sections.indexOf(section)===getResult.sections.length-1 && section.lines.indexOf(line)===section.lines.length-1)
	// 												res.json({status:'success',data:getResult});

	// 										})
	// 										.error(function(err){
	// 											res.json(500,{status:'get section error', error:err});
	// 										})
	// 									})
	// 									.error(function(err){
	// 										res.json(500,{status:'get section error', error:err});
	// 									})
	// 								})
	// 							}
	// 						})
	// 					})
	// 				}
	// 			})
	// 			.error(function(err){
	// 				res.json(500,{status:'get section error', error:err});
	// 			})
	// 		}
	// 	})
	// 	.error(function(err){
	// 		res.json(500,{status:'get header error', error:err});
	// 	})
	// }
}