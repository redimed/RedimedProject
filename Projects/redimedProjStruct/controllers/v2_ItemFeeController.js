var db = require('../models');
var fs = require('fs');

var parseString = require('xml2js').parseString;

var item_fees_model = require('../v1_models/Cln_item_fees.js');
var fund_fees_model = require('../v1_models/Cln_item_health_fund_fees.js');
var type_fees_model = require('../v1_models/Cln_fee_types.js');
var funds_model = require('../v1_models/Cln_private_fund.js');

var kiss=require('./kissUtilsController');
var errorCode=require('./errorCode');
var controllerCode="RED_V2ItemFee";


var general_process = function(req, res){
	// PROCESS FILE UPLOAD
	var _self = this;
	var file_name = null;
	var UPLOAD_FOLDER = db.FeeGroup.getUploadPath();

	this.set_file_name = function(name){
		file_name = name;
	}

	this.process_file_upload = function(){
		if(!file_name) {
			throw 'File name is null !!!';
		}

		// PROCESS FILE UPLOAD
		var tmp_path = req.files.file.path;
		var target_path = UPLOAD_FOLDER + file_name; 

		// move file
		fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            fs.unlink(tmp_path, function() { // delete 
                if (err){ 
                	console.log(err)
                	throw err;
                } 
                console.log('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
            });
        });
		// END PROCESS FILE UPLOAD
	}

	this.update_price_source_group_fee = function(group_id){
		if(!group_id){
			res.json(500, {"status": "error"});
		}
		var updateData = {PRICE_SOURCE: file_name};
		// BELONGS TO FEE GROUP
		db.FeeGroup.update(updateData, {FEE_GROUP_ID: group_id})
		.then(function(result){
			return db.FeeType.update(updateData, {FEE_GROUP_ID: group_id})
		})
		.then(function(result){
			res.json({"status": "success", filename: file_name});
		})
		.error(function(err){
			res.json(500, {"status": "error", "message": error});
		});
	}


	this.update_type_fee_from_source = function(list_group_types, group_type){
		if(!file_name) {
			throw 'File name is null !!!';
		}

		var is_fund_type = (group_type && group_type == 'fund') ? true : false;
		var is_item_fee_type = (group_type && group_type == 'item_fee') ? true: false;
		var is_fee_type = (!is_fund_type && !is_item_fee_type);
		
		console.log(is_fund_type, is_item_fee_type, is_fee_type);

		var process_group = list_group_types; // FEE TYPES OF GROUP
		var source_arr = []; // ARRAY FEES AFTER READ SOURCE FILE
		var process_data = {
			step_num: 400, 
			total_num: 0,
			left_num: 0,
			done_num: 0,
		};
		
		var checksumHandle = function(){
			if( source_arr.length == 0) { // checksum
				res.json({status: 'success'});
				return;
			} 

			if(source_arr.length > process_data.step_num) {
				var process_arr = source_arr.splice(0, process_data.step_num); 
			} else {
				var process_arr = source_arr;
				source_arr = [];
			}

			if(is_fee_type)
				var sql = item_fees_model.sql_insert_group_fees(process_group, process_arr);
			else if (is_fund_type)
				var sql = fund_fees_model.sql_insert_fund_fees(process_group, process_arr);
			else if (is_item_fee_type)
				var sql = item_fees_model.sql_insert_xml_group_fees(process_group, process_arr);


			db.sequelize.query(sql)
        	.success(function(data){
        		if((process_data.total_num - process_data.done_num) > process_data.step_num)
	            	process_data.done_num += process_data.step_num;
	            else 
	            	process_data.done_num = process_data.total_num;

	            console.log('DONE RECORDS: ' + process_data.done_num + ' / ' +  process_data.total_num );
	       		checksumHandle();
	        })
	        .error(function(err){
	            res.json({status:'error', err:err});
	        });
		}

		
		var processPriceSource = function(file){
			fs.readFile(file, "utf-16", function(err, data){
				if(err){
					console.log(err)
					res.json(500, {"status": "error"});
					return;
				}

				if(is_item_fee_type) {
					if(file.indexOf('.xml') > 0) { // CHECK FILE XML 
						console.log('PROCESS XML HERE ', Date.now());

						parseString(data, function (err, xml_result) {
							if(err) {
								console.log(err);
								res.json(500, {"status": "error"});
								return;
							}
							console.log('PROCESS XML DONE ', Date.now());

							source_arr = xml_result.MBS_XML.Data;  // ASSIGN GLOBAL
							process_data.total_num =  source_arr.length; // ASSIGN GLOBAL
							process_data.left_num = source_arr.length; // ASSIGN GLOBAL
							checksumHandle();
						});
					} 
					return;
				}
		
				
		
				if(is_fee_type) {
					source_arr = item_fees_model.process_content_file(data); // ASSIGN GLOBAL
				} else {
					source_arr = fund_fees_model.process_content_file(data); // ASSIGN GLOBAL
					process_data.step_num = parseInt(process_data.step_num  / process_group.length);  // ASSIGN GLOBAL
				}
				if(!source_arr || source_arr.length == 0){
					res.json('File is invalid format');
					return;
				}
				
				process_data.total_num =  source_arr.length; // ASSIGN GLOBAL
				process_data.left_num = source_arr.length; // ASSIGN GLOBAL

				checksumHandle();
			});	
		}

		processPriceSource(UPLOAD_FOLDER + file_name);
	}
}

module.exports = {
	/*
	*	ITEM FUND FEES
	*/


	// SEARCH PRIVATE FUND
	postSearchFundFees:function(req, res) {
		// var limit = (req.body.limit) ? req.body.limit : 10;
  //       var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		// var search_data = req.body.search;

		db.PrivateFund.findAndCountAll({
			// offset: offset,
			// limit: limit,
			attributes: fields,
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	//	SEARCH PRIVATE FUND FEE OF AN ITEM 
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

	// INSERT PRIVATE FUND FEE OF AN ITEM
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
	*	ITEM FEE GROUP
	*/

	// SEARCH FEE GROUP 
	// created by: tannv.dts@gmail.com
	// modify: tannv.dts@gmail.com
	postSearchGroupFees:function(req, res) {
		var fHeader="v2_ItemFeeController->postSearchGroupFees";
		var functionCode="FN001";
		kiss.exlog(req.body);
		var fields = req.body.fields;
		//tannv begin
		var searchs=req.body.search?req.body.search:{};
		searchs.ISENABLE=1;
		if(searchs.SHOW_ALL && searchs.SHOW_ALL==1)
		{
			delete searchs.ISENABLE;
		}
		delete searchs.SHOW_ALL;
		//tannv end

		db.FeeGroup.findAndCountAll({
			// offset: offset,
			// limit: limit,
			attributes: fields,
			where:searchs,//tannv add
			order:[["FEE_GROUP_TYPE","ASC"],["FEE_GROUP_NAME","ASC"],['ISENABLE','DESC']]//tannv add
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			kiss.exlog(fHeader,error);
			res.json(500, {"status": "error", "message": error});
		});
	},


	/**
	 * created by: khanh
	 * tannv mark 08-07-2015
	 */
	// UPLOAD PRICE SOURCE TO GROUP 
	uploadUploadGroupPriceSource: function(req, res) {
		var group_id = req.body.FEE_GROUP_ID;

		db.FeeGroup.find(group_id)
		.success(function(groupInstance){
			// NOT EXISTS FEE GROUP
			if(!groupInstance) { 
				res.json(500, {"status": "error", "message": error});
				return;
			}

			var processInstance = new general_process(req, res);
			var fname= Date.now() + '-' +  req.files.file.name ;
			console.log('process start')
			processInstance.set_file_name(fname);
			processInstance.process_file_upload();
			processInstance.update_price_source_group_fee(groupInstance.FEE_GROUP_ID);
		})
		.error(function(err){
			console.log(err);
			res.json(500, {"status": "error", "message": error});
		})
	},

	// UPDATE PRICE FROM PRICE SOURCE OF GROUP 
	postUpdateGroupPriceSource: function(req, res) {
		var group_id = req.body.FEE_GROUP_ID;
		// var group_id = req.query.id;

		db.FeeGroup.find(group_id)
		.success(function(groupInstance){
			if(!groupInstance || !groupInstance.PRICE_SOURCE) {
				res.json(500, {"status": "error", "message": 'No Group / Source Availabel !!!'});
				return;
			}

			req.setTimeout(300000 , function(){ res.end(); })

			var processInstance = new general_process(req, res);
			processInstance.set_file_name(groupInstance.PRICE_SOURCE);

			if(groupInstance.FEE_GROUP_TYPE == 'fee_type' || groupInstance.FEE_GROUP_TYPE == 'item_fee_type' ) { // PROCESS FEETYPE
				groupInstance.getFeeTypes({fields: ['FEE_TYPE_ID']}).success(function(feeTypes){
					if(feeTypes.length == 0) {
						res.json(500, {"status": "error", "message": 'No Type in group'});
						return;
					}
					if(groupInstance.FEE_GROUP_TYPE == 'fee_type')
						processInstance.update_type_fee_from_source(feeTypes);
					else 
						processInstance.update_type_fee_from_source(feeTypes, 'item_fee');
				}).error(function(err){
					console.log(err);
					res.json(500, {"status": "error", "message": error});
				});
				
			} else { // PROCESS PRIVATE FUND
				var col = 'is' + groupInstance.FEE_GROUP_NAME.toUpperCase();
				var where_opt = {};
				where_opt[col] = 1;

				db.PrivateFund.findAll({
					fields: ['PF_id'],
					where: where_opt
				}).success(function(feeTypes){
					if(feeTypes.length == 0) {
						res.json(200, {"status": "warning", "message": 'No fund in '+ groupInstance.FEE_GROUP_NAME.toUpperCase()});
						return;
					}
					processInstance.update_type_fee_from_source(feeTypes, 'fund');
				}).error(function(err){
					console.log(err);
					res.json(500, {"status": "error", "message": err});
				});
			}
		}).error(function(err){
			console.log(err);
			res.json(500, {"status": "error", "message": error});
		});
	},

	/*
	*	ITEM FEE TYPES
	*/

	// SEARCH FEE TYPES 
	postSearchTypeFees:function(req, res) {
		// var limit = (req.body.limit) ? req.body.limit : 10;
  //       var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		// var search_data = req.body.search;

		db.FeeType.findAndCountAll({
			// offset: offset,
			// limit: limit,
			attributes: fields,
			order: [
				['FEE_GROUP_ID', 'DESC'],
				['FEE_GROUP_ORDER', 'ASC'],
			],
			include: [
				{ 
					model: db.FeeGroup , as: 'FeeGroup',
				},
			]
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	// SEARCH FEE TYPES OF AN ITEM
	postGetItemFees: function(req, res) {
		var search = req.body.search;
		var item_id = search.item_id; 
		var fields = req.body.fields;

		if(!item_id){
			res.json(500, {"status": "error"});
			return;
		}
		var sql = type_fees_model.sql_item_fees(item_id, fields);

		db.sequelize.query(sql)
        .success(function(data){
            res.json({status:'success', list:data});
        })
        .error(function(err){
            res.json({status:'error', err:err});
        });
	},

	// INSERT FEE TYPES OF AN ITEM
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

	// UPLOAD PRICE SOURCE TO TYPE 
	uploadUploadTypePriceSource: function(req, res) {
		var type_id = req.body.FEE_TYPE_ID;

		db.FeeType.find(type_id)
		.success(function(typeInstance){
			// NOT EXISTS FEE TYPE
			if(!typeInstance) { 
				res.json(500, {"status": "error", "message": error});
				return;
			}
			var UPLOAD_FOLDER = db.FeeGroup.getUploadPath();

			var processInstance = new general_process(req, res);
			var fname = Date.now() + '-' +  req.files.file.name ;

			// PROCESS FILE UPLOAD
			processInstance.set_file_name(fname);
			processInstance.process_file_upload();

			// NOT BELONGS TO FEE GROUP
			if(!typeInstance.FEE_GROUP_ID || typeInstance.FEE_GROUP_ID < 0) {
				var updateData = {PRICE_SOURCE: fname};
				db.FeeType.update(updateData, {FEE_TYPE_ID: typeInstance.FEE_TYPE_ID})
				.then(function(result){
					res.json({"status": "success", filename: fname});
				})
				.error(function(err){
					res.json(500, {"status": "error", "message": error});
				});
				return;
			}
			// BELONGS TO FEE GROUP

			processInstance.update_price_source_group_fee(typeInstance.FEE_GROUP_ID);
		})
		.error(function(err){
			console.log(err);
			res.json(500, {"status": "error", "message": error});
		})
	},

	// UPDATE PRICE SOURCE FROM FEE TYPE
	postUpdateTypePriceSource: function(req, res){
		var type_id = req.body.FEE_TYPE_ID;

		db.FeeType.find(type_id)
		.success(function(typeInstance){
			// NOT EXISTS FEE TYPE
			if(!typeInstance || !typeInstance.PRICE_SOURCE) { 
				res.json(500, {"status": "error", mesage: 'No type / source Availabel'});
				return;
			}
			req.setTimeout(300000 , function(){ res.end(); })

			var processInstance = new general_process(req, res);
			processInstance.set_file_name(typeInstance.PRICE_SOURCE);
			
			// PROCESS TYPE HAS NO GROUP 
			if(!typeInstance.FEE_GROUP_ID || typeInstance.FEE_GROUP_ID < 0) {
				processInstance.update_type_fee_from_source([{FEE_TYPE_ID: typeInstance.FEE_TYPE_ID}]);
				return;
			} 

			// PROCESS TYPE HAS GROUP 
			db.FeeType.findAll({
				where: {FEE_GROUP_ID: typeInstance.FEE_GROUP_ID},
				attributes: ['FEE_TYPE_ID'],
				order: 'FEE_GROUP_ORDER ASC',
			}).success(function(result){
				// processPriceSource(file_name, result);
				processInstance.update_type_fee_from_source(result);
			}).error(function(err){
				console.log(err);
				res.json(500, {"status": "error", "message": error});
			});
		}).error(function(err){
			console.log(err);
			res.json(500, {"status": "error", "message": error});
		})
	},
	/*
	*	????????????? TEST 
	*/
	getTest: function(req, res) {
		var upload_path = 'Data/';
		var filename = req.query.file ? req.query.file : 'HBF10.txt';
		var type_id = 1;

		fs.readFile(upload_path + filename, "utf-8", function(err, data){
			if(err){
				res.json(500, {"status": "error"});
				return;
			}
			var arr = item_fees_model.process_content_file(data);
			// var query = item_fees_model.sql_insert_type_fees(type_id, arr)
			console.log(arr.length);
			res.json(arr)
		});
	},

	/**
	 * Remove item fee
	 * tannv.dts@gmail.com
	 * 30-07-2015
	 */
	postRemoveItemFee:function(req,res){
		var fHeader="v2_ItemFeeController->postRemoveItemFee";
		var functionCode="FN002";
		var itemFeeId=kiss.checkData(req.body.itemFeeId)?req.body.itemFeeId:'';
		if(!kiss.checkListData(itemFeeId))
		{
			res.json({status:'success',msg:'not found item fee id'});
			return;
			// kiss.exlog(fHeader,'Loi data truyen den');
			// res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
			// return;
		}
		var sql="DELETE FROM `cln_item_fees` WHERE ITEM_FEE_ID=?";
		kiss.executeQuery(req,sql,[itemFeeId],function(result){
			res.json({status:'success'});
		},function(err){
			kiss.exlog(fHeader,'Loi truy van xoa item fee',err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
		},true)
	}

	
}