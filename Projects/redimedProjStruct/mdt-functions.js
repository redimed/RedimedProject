var fs = require('fs');

module.exports = {
	commonSearch: function(post_fields){
		var sql_where = "";
		var select_fields = [];

		for(var i = 0; i < post_fields.length; i++){
			if(post_fields[i].type === 'text'){
				sql_where += "IFNULL("+post_fields[i].name+", '') LIKE '%"+post_fields[i].value+"%' AND ";
			}else if(post_fields[i].type === 'select'){
				if(post_fields[i].value === null)
					post_fields[i].value = '';
				sql_where += "IFNULL("+post_fields[i].name+", '') LIKE '%"+post_fields[i].value+"%' AND ";
			}
			select_fields.push(post_fields[i].name);
		}// end for

		sql_where = sql_where.substring(0, sql_where.length - 5);

		return sql_where;
	},// end commonSearch

	appendString:function(fullString, appendString, index, rem) {
    	return (fullString.slice(0,index) + appendString + fullString.slice(index + Math.abs(rem)));
	},

	createFile: function(directory, filename, content){
		var file = directory+"/"+filename+".js";

		fs.exists(file, function(exists){
			if(exists){
				return false;
			}else{
				fs.appendFile(file, content, encoding='utf-8', function(error){
					if(error) {
						throw error;
						return false;
					}
					else return true;
				});
			}
		});
	}
}