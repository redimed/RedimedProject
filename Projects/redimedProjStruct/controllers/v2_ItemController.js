var db = require('../models');
var fs = require('fs');
var mdt_functions = require('../mdt-functions.js');

var item_model = require('../v1_models/Inv_items.js');
var item_fees_model = require('../v1_models/Cln_item_fees.js');
var parseString = require('xml2js').parseString;

var general_process = function(req, res){

	var UPLOAD_FOLDER = db.FeeGroup.getUploadPath();

	this.set_file_name = function(name){
		file_name = name;
	}

	this.insert_item_from_source = function(){
		if(!file_name) {
			throw 'File name is null !!!';
		}

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

			var sql = item_model.sql_insert_from_source( process_arr);

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
			fs.readFile(file, "utf-8", function(err, data){
				if(err){
					console.log(err)
					res.json(500, {"status": "error"});
					return;
				}
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
			});	
		}

		processPriceSource(UPLOAD_FOLDER + file_name);
	}

	this.import_item_from_source = function(list_group_types){
		if(!file_name) {
			throw 'File name is null !!!';
		}
		var process_group = list_group_types;
		var source_arr = []; // ARRAY FEES AFTER READ SOURCE FILE
		
		var insert_arr = [];
		var insert_fee_arr = [];
		var update_arr = [];
		var err_arr = [];


		var process_data = {
			step_num: 1, 
			total_num: 0,
			left_num: 0,
			done_num: 0,
		};

		var timeData = {
			start: Date.now(),
			startReadXML : null,
			endReadXML: null,
			startProcessDB: null,
			endProcessDB: null,
		}

		var checksumHandle = function(){
			if( source_arr.length == 0) { // checksum
				timeData.endProcessDB = Date.now();
				res.json({
					status: 'success', 
					time: timeData,
					insert:  {total: insert_arr.length, data: insert_arr },
					insert_fee: {total: insert_fee_arr.length, data: insert_fee_arr },
					update: {total: update_arr.length, data: update_arr },
					error: err_arr
				});
				return;
			} 

			if(source_arr.length > process_data.step_num) {
				var process_arr = source_arr.splice(0, process_data.step_num); 
			} else {
				var process_arr = source_arr;
				source_arr = [];
			}

			var item = process_arr[0];
			var item_code = item.ItemNum[0];

			db.InvItem.find({ // SEARCH ITEM 
				where: {ITEM_CODE: item_code},
				attributes: ['ITEM_ID']
			})
			.then(function(instance){ 
				var postData = item_model.build_instance_from_xml_node(item);

				if(!instance) { // INSERT IF NOT EXIST
					insert_arr.push(item_code);
					return db.InvItem.create(postData);
				}
				// UPDATE IF EXIST
				update_arr.push(item_code);
				return db.InvItem.update(postData, {ITEM_CODE: item_code});
			})
			.then(function(){
				// INSERT INTO ITEM FEES 
				var sql = item_fees_model.sql_insert_xml_group_fees(process_group, process_arr);
				if(sql == '') {
					checksumHandle();
					return;
				}

				insert_fee_arr.push(item_code);

				// CONSOLE 
				if((process_data.total_num - process_data.done_num) > process_data.step_num)
	            	process_data.done_num += process_data.step_num;
	            else 
	            	process_data.done_num = process_data.total_num;

	            console.log('DONE RECORDS: ' + process_data.done_num + ' / ' +  process_data.total_num );

				db.sequelize.query(sql)
				.success(function(){
					checksumHandle();
				})
				.error(function(err){
					err_arr.push({
						code: item_code, error: err
					});
					checksumHandle();
				})
			})
			.error(function(err){
				// ERROR
				err_arr.push({
					code: item_code, error: err
				});
				checksumHandle();
			})
		}

		var processPriceSource = function(file){
			fs.readFile(file, "utf-8", function(err, data){
				if(err){
					console.log(err)
					res.json(500, {"status": "error"});
					return;
				}
				timeData.startReadXML = Date.now();
				parseString(data, function (err, xml_result) {
					if(err) {
						console.log(err);
						res.json(500, {"status": "error"});
						return;
					}
					timeData.endReadXML = Date.now();
					source_arr = xml_result.MBS_XML.Data;  // ASSIGN GLOBAL
					process_data.total_num =  source_arr.length; // ASSIGN GLOBAL
					process_data.left_num = source_arr.length; // ASSIGN GLOBAL

					timeData.startProcessDB = Date.now();
					checksumHandle();
				});
			});	
		}

		processPriceSource(UPLOAD_FOLDER + file_name);
	}
}

module.exports = {
	postSearch: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;
		// console.log(search_data)
		var agrs = [];
		for (var key in search_data) {
			if(search_data[key])
			agrs.push(key + " LIKE '"+ search_data[key] +"%'");
		};

		var whereOpt = agrs.length ? db.Sequelize.and.apply(null, agrs) : null;

		db.InvItem.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
			order: 'Creation_date DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postDetail: function(req, res){
		var id = req.body.ITEM_ID;

		db.InvItem.find(id)
		.success(function(data){
			res.json({"status": "success", "data": data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postInsert : function(req, res) {
		var postData = req.body;

		db.InvItem.create(postData)
		.success(function(data, created){
			res.json({"status": "success", "data": data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postUpdate: function(req, res) {
		var postData = req.body;

		var item_id = postData.ITEM_ID;
		delete postData.ITEM_ID;

		db.InvItem.update(postData, {ITEM_ID: item_id})
		.success(function(data){
			res.json({"status": "success", "data": data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
	},

	anyHeaderItem: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields =  req.body.fields;

		var search_data = req.body.search;
		var header_id = search_data.POPULAR_HEADER_ID;
		// POPULAR_HEADER_ID

		// var header_id = req.query.id;

		db.InvItemHeader.find({
			where: {POPULAR_HEADER_ID: header_id},
			attributes: ['POPULAR_HEADER_ID'],
			include: [
				{ 
					model: db.InvItem , as: 'Items',
					// attributes: fields,
				},
			]
		})
		.success(function(header){
			if(!header) {
				res.json(500, {"status": "error"});
				return;
			}
			res.json({list: header.items, count: header.items.length});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})	
	},

	postInsertHeaderItems: function(req, res) {
		var header_id = req.body.header_id; // 2  
		var items = req.body.items;  //  [6225, 6224] 

		if(!header_id || !items || items.length === 0){
			res.json(500, {"status": "error"});
			return;
		}

		var list = [];
		for (var i = items.length - 1; i >= 0; i--) {
			list.push({POPULAR_HEADER_ID: header_id, ITEM_ID: items[i]});
		};

		// console.log('HEADER ', header_id);
		// console.log('items', items)


		// console.log(db.InvItemLine);

		db.InvItemLine.bulkCreate(list)
		.success(function(data) {
		  	res.json({"status": "success"});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
	},

	postUpdateHeaderItem: function(req, res){
	},

	anyHeaderSearch: function(req, res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		// InvItemHeader

		db.InvItemHeader.findAndCountAll({
			offset: offset,
			limit: limit,
			attributes: fields,
			order: 'POPULAR_NAME DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})	
	},
	
	postInsertHeader: function(req, res) {
		var postData = req.body;

		db.InvItemHeader.findOrCreate(postData)
		.success(function(data, created){
			if(!created){
				res.json({"status": "warning", "data": data, message: 'Duplicate Popular code'});
				return;
			}
			res.json({"status": "success", "data": data});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},

	postInsertFromSource: function(req, res){
		db.FeeGroup.find({
			where: {FEE_GROUP_TYPE: 'item_fee_type'}
		})
		.success(function(groupInstance){
			if(!groupInstance || !groupInstance.PRICE_SOURCE) {
				res.json(500, {"status": "error", "message": 'No Group / Source Availabel !!!'});
				return;
			}
		
			var processInstance = new general_process(req, res);
			processInstance.set_file_name(groupInstance.PRICE_SOURCE);
			processInstance.insert_item_from_source();

		}).error(function(err){
			console.log(err);
			res.json(500, {"status": "error", "message": error});
		});
	},

	postImportFromSource : function(req, res){
		db.FeeGroup.find({
			where: {FEE_GROUP_TYPE: 'item_fee_type'},
			include: [{ 
				model: db.FeeType , as: 'FeeTypes',
			},]
		})
		.success(function(groupInstance){
			if(!groupInstance || !groupInstance.PRICE_SOURCE || groupInstance.feeTypes.length === 0) {
				res.json(500, {"status": "error", "message": 'No Group / Source Availabel !!!'});
				return;
			}
		
			var processInstance = new general_process(req, res);
			processInstance.set_file_name(groupInstance.PRICE_SOURCE);
			req.setTimeout(600000 , function(){ res.end(); })
			processInstance.import_item_from_source(groupInstance.feeTypes);
			// processInstance.insert_item_from_source();

			// groupInstance.getFeeTypes({fields: ['FEE_TYPE_ID']}).success(function(feeTypes){
			// 	if(feeTypes.length == 0) {
			// 		res.json(500, {"status": "error", "message": 'No Type in group'});
			// 		return;
			// 	}
				
			// }).error(function(err){
			// 	console.log(err);
			// 	res.json(500, {"status": "error", "message": error});
			// });

		}).error(function(err){
			console.log(err);
			res.json(500, {"status": "error", "message": error});
		});
	},

	/**
	*	SEARCH ITEM FEE
	*/
	postSearchItemFees: function(req, res) {
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;

		var agrs = [];
		for (var key in search_data) {
			if(search_data[key])
			agrs.push(key + " LIKE '"+ search_data[key] +"%'");
		};
		var whereOpt = agrs.length ? db.Sequelize.and.apply(null, agrs) : null;

		db.InvItem.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
			order: 'ITEM_ID DESC',
			include: [
                { 
                    model: db.FeeType , as: 'FeeTypes'
                },
            ]
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	}
}