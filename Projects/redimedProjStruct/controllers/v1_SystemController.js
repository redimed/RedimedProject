var squel = require("squel");
squel.useFlavour('mysql');

var model_sql = {
	/**
	*	SQL OF SYS TABLE
	*/
	sql_list_countries: function(is_option){
		var querybuilder = squel.select().from('sys_countries');
		querybuilder.where('ISENABLE = ?', 1);
		if(is_option == 1) {
			querybuilder.field('Country_name');
		}
		return querybuilder.toString();
	},

	sql_list_taxes: function(is_option){
		var querybuilder = squel.select().from('sys_taxes');
		querybuilder.where('ISENABLE = ?', 1);
		if(is_option == 1) {
			querybuilder.field('TAX_ID').field('TAX_NAME');
		}
		return querybuilder.toString();
	},
	sql_list_services: function(is_option){
		var querybuilder = squel.select().from('sys_services');
		querybuilder.where('ISENABLE = ?', 1);
		if(is_option == 1) {
			querybuilder.field('SERVICE_ID').field('SERVICE_NAME');
		}
		return querybuilder.toString();
	},
	sql_list_prefix_headers: function(form_code, is_option){
		var querybuilder = squel.select().from('sys_prefix_headers');
		querybuilder.where('ISENABLE = ?', 1);

		if(form_code) {
			querybuilder.where('FORM_CODE = ? ', form_code);
		}

		if(is_option == 1) {
			querybuilder.field('PREFIX').field('PREFIX_NAME');
		}
		return querybuilder.toString();
	},
	/**
	*	SQL OF CLN
	*/
	sql_list_provider_types: function(is_option) {
		var querybuilder = squel.select().from('cln_provider_types');
		querybuilder.where('ISENABLE = ?', 1);
		if(is_option == 1) {
			querybuilder.field('Provider_types_id').field('Provider_types_name');
		}
		return querybuilder.toString();
	}
}

module.exports = {
	/**
	*	SQL OF SYS TABLE
	*/
	getListCountries: function (req, res) {
        var is_option = req.query.is_option;

        var k_sql = res.locals.k_sql;
        var sql = model_sql.sql_list_countries(is_option);

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    getListServices: function (req, res) {
        var is_option = req.query.is_option;

        var k_sql = res.locals.k_sql;
        var sql = model_sql.sql_list_services(is_option);

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
	getListTaxes: function (req, res) {
        var is_option = req.query.is_option;

        var k_sql = res.locals.k_sql;
        var sql = model_sql.sql_list_taxes(is_option);

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    getListPrefixHeaders: function (req, res) {
        var is_option = req.query.is_option;

		var form_code = req.query.form_code;

        var k_sql = res.locals.k_sql;
        var sql = model_sql.sql_list_prefix_headers(form_code, is_option);

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },


    /**
	*	SQL OF CLN TABLE
	*/
    getListProviderTypes: function (req, res) {
        var is_option = req.query.is_option;
 
        var k_sql = res.locals.k_sql;
        var sql = model_sql.sql_list_provider_types(is_option);

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },

    getTest: function (req, res) {
        var k_sql = res.locals.k_sql;
        var sql = 'SELECT user_name from users LIMIT 10';

        var users = [], patients = [];

        k_sql.exec(sql)
        .then(function(data){
        	users = data;
        	return k_sql.exec('SELECT patient_id from cln_patients LIMIT 10')
        })
        .then(function(data){
        	patients = data;
        	return k_sql.exec_row('SELECT * from users where user_name =\'drhanh\'');
        })
         .then(function(data){

        	res.json({patients: patients, user: users, dr: data});
        })
        .catch(
        	function(err){res.json(err);
        })
    },

}