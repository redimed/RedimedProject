var InsurerModel = require('../v1_models/Cln_insurers');

module.exports = {
	
	postSearch: function(req, res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;

		//var sql = CompanyModel.sql_search_item(limit, offset, code, name, type);

		var search_data = req.body.search;
		
		if(search_data) {
			InsurerModel._callback.search = function(query_builder){
				// for (var key in search_data) {
				// 	query_builder.where(key + ' LIKE ?', '%' + search_data[key] + '%');
				// }
			};
		}
		
		var sql_count = InsurerModel.sql_search_count();
        var sql_data = InsurerModel.sql_search_data(limit, offset, fields);
		
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
	
}