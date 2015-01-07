var db = require('../models');
var CompanyModel = require('../v1_models/Companies');
var InsurerModel = require('../v1_models/Cln_insurers');

module.exports = {

	getDetail: function(req, res) {
		var id = req.query.id;
		if(!id) {
			res.end();
			return; 
		}
		// var query = CompanyModel.query_get(id);
		// query.left_join('cln_insurers', null, 'companies.Insurer = cln_insurers.id');
		// var sql =  query.toString();

				var k_sql = req.k_sql;

		var company_data = {};

		var sql = CompanyModel.sql_get(id);

		k_sql.exec_row(sql, function(data){
			company_data = data;	
			if(!company_data.Insurer) {
				res.json({status: 'success', row: company_data});
				return; 
			}

			var sql =  InsurerModel.sql_get(company_data.Insurer);
			k_sql.exec_row(sql, function(data2){
				company_data.insurer_data = data2;
				res.json({status: 'success', row: company_data});	
			},function(err){
				res.json({status: 'error'});
			})
		},function(err){
			res.json({status: 'error'});
		})


	},
	postGetAll : function (req, res) {
		var fields = req.body.fields;

		var sql = CompanyModel.sql_get_all(fields);
		var k_sql = res.locals.k_sql;

		k_sql.exec(sql, function (data) {
			res.json({status: 'success', list: data});
        }, function(err) {
			res.json({status: 'error'});
		});
	}, 
	postInsert: function(req, res) {
		var post_data = req.body.data;

		if(!post_data) {
			res.end();
			return; 
		}

		var sql = CompanyModel.sql_insert(post_data);
		var k_sql = res.locals.k_sql;

		var err_handle = function(err){
		console.log(err);
            res.json('error')
        };

        var insertId = 0;
		if(post_data.Insurer) {
			k_sql.exec(sql).then(function (data) {
				insertId = data.insertId;
	            var sql2 = CompanyModel.sql_insert_company_insurer(insertId, post_data.Insurer);
	            return k_sql.exec(sql2);
	        }).then(function (data) {
	            res.json({'status' : 'success', insertId: insertId});
	        }).catch(err_handle);
        } else {
        	k_sql.exec(sql, function(data){
        		res.json({'status' : 'success', insertId: data.insertId});
        	}, err_handle);
        }
	},
	postUpdate: function(req, res) {
		var id = req.body.id;
		var post_data = req.body.data;
		if(!id || !post_data) {
			res.end();
			return; 
		}
		var err_handle = function(err){
		console.log(err);
            res.json('error')
        };
		var sql = CompanyModel.sql_update(id, post_data);
		var k_sql = res.locals.k_sql;
		
		if(post_data.Insurer) {
			k_sql.exec(sql).then(function (data) {
	            var sql2 = CompanyModel.sql_insert_company_insurer(id, post_data.Insurer);
	            return k_sql.exec(sql2);
	        }).then(function (data) {
	            res.json({'status' : 'success'});
	        }).catch(function (err) {
	            res.json({'status' : 'success'});
	        });
		} else {
			k_sql.exec(sql, function (data) {
				res.json({status: 'success'});
	        }, err_handle);
		}
	},
	postDelete: function(req, res) {
		var id = req.body.id;

		if(!id) {
			res.end();
			return; 
		}

		var sql = CompanyModel.sql_delete(id);
		var k_sql = req.k_sql;
		k_sql.exec( function(data){
			res.json({status: 'success', data: data});
		}, function(err) {
			console.log(err);
			res.json({status: 'error'});
		});
	},
		
	postSearch: function(req, res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;

		var search_data = req.body.search;
		
		if(search_data) {
			CompanyModel._callback.search = function(query_builder){
				for (var key in search_data) {
					query_builder.where(key + ' LIKE ?', '%' + search_data[key] + '%');
				}
			};
		}
		
		var sql_count = CompanyModel.sql_search_count();
      	var sql_query = CompanyModel.query_search_data(limit, offset, fields);

      	var is_request_insurer = false;
      	for(var key in fields) {
      		if(fields[key].toLowerCase() == 'insurer') {
      			is_request_insurer = true;
      			break;
      		}
      	}

      	if(is_request_insurer) {
      		sql_query.left_join("cln_insurers", 'insurers', "insurers.id = companies.Insurer");
      	}
        var sql_data = sql_query.toString();	
		var k_sql = req.k_sql;
		var result = null;

	    db.sequelize.query(sql_data).then(function(data){
	    	result = data;
	    	return  db.sequelize.query(sql_count);
	    }).then(function(row){
			res.json({list: result, count: row[0].count});
		}).error(function(err){
            res.json({status: 'error', error: err});
        })


		// k_sql.exec(sql_data).then(function(data){
		// 	result = data;
		// 	return k_sql.exec_row(sql_count);
		// }).then(function(row){
		// 	res.json({list: result, count: row.count});
		// }).catch(function(err){
		// 	console.log(err);
		// })
	},

	postInsurers : function(req, res) {
		
		var search_data = req.body.search;

		// console.log(search_data, fields)
		var company_id = search_data.id;
		var fields = req.body.fields;


		db.Company.find({
			where: {id: company_id},
			attributes: ['id'],
			include: [
				{ 
					model: db.Insurer , as: 'Insurers',
					attributes: fields,
				},
			]
		}).success(function(company){
			if(!company) {
				res.json(500, {"status": "error"});
				return;
			}
			res.json({list: company.insurers, count: company.insurers.length});
		}) .error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	}
}