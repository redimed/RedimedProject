var db = require("../models");
var knex = require("../knex-connect.js");
var moment = require('moment');
var extend = require('util')._extend;
var fs = require('fs');//Read js file for import into

var Promise = require('promise');

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
		.select('FA_ID','FA_NAME','TYPE','ISENABLE','Creation_date')
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

	postFaChooseSearch: function(req,res){
		var postData = req.body;
		var patient_id = postData.search.patient_id;
		var cal_id = postData.search.cal_id;

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
		.select('FA_ID','FA_NAME','TYPE','ISENABLE','Creation_date')
		.from('sys_fa_df_headers')
		.where('FA_NAME','like','%'+whereClause.FA_NAME+'%')
		.andWhere('TYPE','like','%'+whereClause.TYPE+'%')
		.whereNotIn( 'FA_ID',
			knex
			.select('FA_ID')
			.from('cln_fa_df_headers')
			.where({
				PATIENT_ID: patient_id,
				CAL_ID: cal_id
			})
		)
		.orderBy('FA_ID','desc')
		.limit(limit)
		.offset(offset)
		.toString();

		var sql2 = knex("sys_fa_df_headers")
		.count("FA_ID as count")
		.where('FA_NAME','like','%'+whereClause.FA_NAME+'%')
		.andWhere('TYPE','like','%'+whereClause.TYPE+'%')
		.whereNotIn( 'FA_ID',
			knex
			.select('FA_ID')
			.from('cln_fa_df_headers')
			.where({
				PATIENT_ID: patient_id,
				CAL_ID: cal_id
			})
		)
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


	postGetHeaderAndSections: function(req,res){
		var getResult = {};
		var headerId = req.body.id;
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

	postEdit: function(req,res){
		var updateHeader = function(header){
			return new Promise(function(resolve, reject){
				var updateHeader = extend({}, header);
				delete updateHeader.sections;
				delete updateHeader.action;
				delete updateHeader.ASSESSED_SIGN;
				//update header
				knex('sys_fa_df_headers')
				.where({FA_ID: header.FA_ID})
				.update(updateHeader)
				.then(function(headerRes){
					for(var i=0; i<header.sections.length; i++){
						header.sections[i].FA_ID=header.FA_ID;
					}
					updateSections(header.sections, header.FA_ID).then(function(result){
						if(result.status === 'failed') res.json(500,{status:'error'});
						else if(result.status ==='success') res.json({status:'success'});
					})
				})
				.error(function(err){
					res.json(500,{status:'error', error:err});
				})
			})
		};

		var updateSections = function(sections, headerId){
			return new Promise(function(resolve, reject){
				sections.forEach(function(section){
					if(section.action==='edit'){
						var updateSection = extend({}, section);
						if(updateSection.lines) delete updateSection.lines;
						delete updateSection.action;
						//update section
						knex('sys_fa_df_sections')
						.where({SECTION_ID: updateSection.SECTION_ID})
						.update(updateSection)
						.then(function(sectionRes){
							if(section.lines.length===0){
								if(sections.indexOf(section)===sections.length-1) resolve({status:'success'});
							}
							else {
								// for(var i=0; i<section.lines.length; i++){
								// 	section.lines[i].SECTION_ID = section.SECTION_ID;
								// 	section.lines[i].FA_ID = headerId;
								// }
								updateLines(section.lines, section.SECTION_ID, headerId).then(function(result){
									if(result.status==='failed') resolve({status:'failed'});
									else{
										if(sections.indexOf(section)===sections.length-1) resolve({status:'success'});
									}
								})
							}

						})
					}
					else if(section.action==='add'){
						var addSection = extend({}, section);
						delete addSection.lines;
						delete addSection.action;
						addSection.FA_ID = headerId;
						//add section
						knex('sys_fa_df_sections')
						.insert(addSection)
						.then(function(sectionRes){
							var sectionId = sectionRes[0];
							if(section.lines.length===0){
								if(sections.indexOf(section)===sections.length-1) resolve({status:'success'});
							}
							else {
								// for(var i=0; i<section.lines.length; i++){
								// 	section.lines[i].SECTION_ID = section.SECTION_ID;
								// 	section.lines[i].FA_ID = headerId;
								// }
								updateLines(section.lines, sectionId, headerId).then(function(result){
									if(result.status==='failed') resolve({status:'failed'});
									else{
										if(sections.indexOf(section)===sections.length-1) resolve({status:'success'});
									}
								})
							}
						})
					}
					else{
						//delete section
						knex('sys_fa_df_sections')
						.where({SECTION_ID: section.SECTION_ID})
						.del()
						.then(function(sectionRes){
							if(section.lines.length===0){
								if(sections.indexOf(section)===sections.length-1) resolve({status:'success'});
							}
							else {
								// for(var i=0; i<section.lines.length; i++){
								// 	section.lines[i].SECTION_ID = section.SECTION_ID;
								// 	section.lines[i].FA_ID = headerId;
								// }
								updateLines(section.lines, null, null).then(function(result){
									if(result.status==='failed') resolve({status:'failed'});
									else{
										if(sections.indexOf(section)===sections.length-1) resolve({status:'success'});
									}
								})
							}
						})
					}
				})
			})
		};

		var updateLines = function(lines, sectionId, headerId){
			return new Promise(function(resolve, reject){
				
				lines.forEach(function(line){
					if(line.action==='edit'){
						var updateLine = extend({}, line)
						updateLine.SECTION_ID = sectionId;
						updateLine.FA_ID = headerId;
						delete updateLine.details;
						delete updateLine.comments;
						delete updateLine.action;
						//update line
						knex('sys_fa_df_lines')
						.where({LINE_ID: updateLine.LINE_ID})
						.update(updateLine)
						.then(function(lineRes){
							updateDetail(line.details, line.comments, line.LINE_ID).then(function(result){
								if(result.status==='success') {
									if(lines.indexOf(line) === lines.length-1) resolve({status:'success'});
								}
								else if(result.status==='failed') resolve ({status:'failed'});
							});
						})
					}
					else if(line.action==='add'){
						var addLine = extend({}, line);
						addLine.SECTION_ID = sectionId;
						addLine.FA_ID = headerId;
						delete addLine.details;
						delete addLine.comments;
						delete addLine.action;
						//insert line
						knex('sys_fa_df_lines')
						.insert(addLine)
						.then(function(lineRes){
							var lineId = lineRes[0];
							updateDetail(line.details, line.comments, lineId).then(function(result){
								if(result.status==='success') {
									if(lines.indexOf(line) === lines.length-1) resolve({status:'success'});
								}
								else if(result.status==='failed') resolve ({status:'failed'});
							});
						})
					}
					else{
						//delete line
						knex('sys_fa_df_lines')
						.where({LINE_ID: line.LINE_ID})
						.del()
						.then(function(lineRes){
							updateDetail(line.details, line.comments, null).then(function(result){
								if(result.status==='success') {
									if(lines.indexOf(line) === lines.length-1) resolve({status:'success'});
								}
								else if(result.status==='failed') resolve ({status:'failed'});
							});
						})
					}
				})
			})
		};

		var updateDetail = function(details, comments, lineId){
			return new Promise(function(resolve, reject){
				if(details.length===0){
					updateComment(comments, lineId).then(function(result){
						if(result.status ==='success') resolve({status:'success'});
						else if(result.status === 'failed') resolve({status:'failed'});
					})
				}
				else{
					details.forEach(function(detail){
						if(detail.action==='edit'){
							var updateDetail = extend({},detail);
							delete updateDetail.action;
							//update detail
							knex('sys_fa_df_line_details')
							.where({DETAIL_ID: updateDetail.DETAIL_ID})
							.update(updateDetail)
							.then(function(detailRes){
								
								if(details.indexOf(detail)===details.length-1){
									updateComment(comments, lineId).then(function(result){
										if(result.status ==='success') resolve({status:'success'});
										else if(result.status === 'failed') resolve({status:'failed'});
									})
								}
							})
							.error(function(err){
								res.json(500,{error:err});
							})
						}
						else if(detail.action === 'add'){
							var addDetail = extend({}, detail);
							delete addDetail.action;
							addDetail.LINE_ID = lineId;
							//insert detail
							knex('sys_fa_df_line_details')
							.insert(addDetail)
							.then(function(detailRes){
								
								if(details.indexOf(detail)===details.length-1){
									updateComment(comments, lineId).then(function(result){
										if(result.status ==='success') resolve({status:'success'});
										else if(result.status === 'failed') resolve({status:'failed'});
									})
								}
							})
						}
						else{
							//delete detail
							knex('sys_fa_df_line_details')
							.where({DETAIL_ID: detail.DETAIL_ID})
							.del()
							.then(function(detailRes){
								if(details.indexOf(detail)===details.length-1){
									updateComment(comments, null).then(function(result){
										if(result.status ==='success') resolve({status:'success'});
										else if(result.status === 'failed') resolve({status:'failed'});
									})
								}
							})
						}
					})
				}
			})
		};

		var updateComment = function(comments, lineId){
			return new Promise(function(resolve, reject){
				if(comments.length===0){
					resolve({status:'success'})
				}
				else{
					comments.forEach(function(comment){
						if(comment.action==='edit'){
							var updateComment = extend({},comment);
							updateComment.LINE_ID = lineId;
							delete updateComment.action;
							//update comment
							knex('sys_fa_df_comments')
							.where({FA_COMMENT_ID: updateComment.FA_COMMENT_ID})
							.update(updateComment)
							.then(function(commentRes){
								if(comments.indexOf(comment)===comments.length-1){
									resolve({status:'success'})
								}
							})
						}
						else if(comment.action==='add'){
							var addComment = extend({}, comment);
							delete addComment.action;
							addComment.LINE_ID = lineId;
							//insert comment
							knex('sys_fa_df_comments')
							.insert(addComment)
							.then(function(commentRes){
								if(comments.indexOf(comment)===comments.length-1){
									resolve({status:'success'})
								}
							})
						}
						else{
							//delete comment
							knex('sys_fa_df_comments')
							.where({FA_COMMENT_ID: comment.FA_COMMENT_ID})
							.del()
							.then(function(commentRes){
								if(comments.indexOf(comment)===comments.length-1){
									resolve({status:'success'})
								}
							})
						}
					})
				}
			})
		}

		updateHeader(req.body);
	},

	postChangeHeaderStt: function(req,res){
		var stt = req.body.status;
		var headerId = req.body.headerId;

		knex('sys_fa_df_headers')
		.where({FA_ID:headerId})
		.update({ISENABLE: stt})
		.then(function(result){
			res.json({status:'success'});
		})
		.error(function(err){
			res.json(500,{status:'error'});
		})
	},

	postGetImages: function(req,res){
		fs.readdir('./download/documentImage', function(err, files){
			if(err) res.json(500, {status:'error'});
			else res.json({status:'success', files: files});
		})
	},

	uploadUploadImage: function(req,res){
		var targetPath = './download/documentImage/'+req.files.file.name;
		var tmpPath = req.files.file.path;

		fs.rename(tmpPath, targetPath, function(err){
			if (err) throw err;
			fs.unlink(tmpPath, function(){
				if(err) res.json(500,{status:'upload failed'});
				else res.json({status:'success'});
			})
		})

	}

}