var k_model = require("./k_model");
var install_model = new k_model('companies', 'id');

install_model.sql_insert_company_insurer = function(company_id, insurer_id) {
	var insert_query = install_model._squel.insert().into('company_insurers');
	insert_query.set('company_id', company_id);
	insert_query.set('insurer_id', insurer_id);
	return insert_query.toString();
};

module.exports = install_model;