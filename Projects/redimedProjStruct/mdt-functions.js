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
	}// end commonSearch
}