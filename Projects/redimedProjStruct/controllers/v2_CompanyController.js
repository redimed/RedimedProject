var CompanyModel = require('../v1_models/Companies');
var InsurerModel =  require('../v1_models/Cln_insurers');

module.exports = {
	
	getSearch: function(req, res){
		var limit = (req.query.limit) ? req.query.limit : 10;
        var offset = (req.query.offset) ? req.query.offset : 0;
		
		var Company_name = req.query.name;
		//var sql = CompanyModel.sql_search_item(limit, offset, code, name, type);
		
		CompanyModel._callback.search = function(query_builder){
			if(Company_name)
				query_builder.where('Company_name LIKE ?', '%' + Company_name + '%');
		};
		
		var sql_count = CompanyModel.sql_search_count();
        var sql_data = CompanyModel.sql_search_data(limit, offset);
		
		var k_sql = req.k_sql;
		var result = null;
		k_sql.exec(sql_data).then(function(data){
			result = data;
			return k_sql.exec_row(sql_count);
		}).then(function(row){
			res.json({list: result, count: row.count});
		}).catch(function(err){
			console.log(err);
		})
		
	},
	
	getGetAll : function (req, res) {
		var sql = CompanyModel.sql_get_all(['id', 'company_name']);
		var k_sql = res.locals.k_sql;

		k_sql.exec(sql, function (data) {
			res.json(data);
        });
	}, 
}