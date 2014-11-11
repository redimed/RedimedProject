var squel = require("squel");
squel.useFlavour('mysql');

var model_sql = {
	/**
	*	SQL OF SYS TABLE
	*/
	sql_list_uoms: function(is_option){
		var querybuilder = squel.select().from('inv_uoms', 'uoms');
		querybuilder.join('inv_uom_classes', 'classes', 'classes.CLASS = uoms.CLASS');
		querybuilder.where('uoms.ISENABLE = ?', 1);
		querybuilder.where('classes.ISENABLE = ?', 1);

		if(is_option == 1) {
			querybuilder.field('classes.CLASS').field('classes.CLASS_NAME').field('UOM').field('UOM_NAME');
		}
		return querybuilder.toString();
	},

}

module.exports = {
	/**
	*	SQL OF SYS TABLE
	*/
	getListUoms: function (req, res) {
        var is_option = req.query.is_option;

        var k_sql = res.locals.k_sql;
        var sql = model_sql.sql_list_uoms(is_option);

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },

}