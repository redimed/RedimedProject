var k_model = require("./k_model");
var install_model = new k_model('cln_patients', 'Patient_id');

install_model.sql_insert_patient_company = function(patient_id, company_id) {
	var insert_query = install_model._squel.insert().into('patient_companies');
	insert_query.set('company_id', company_id);
	insert_query.set('patient_id', patient_id);
	insert_query.set('creation_date', 'NOW()', { dontQuote: true });
	insert_query.set('last_update_date', 'NOW()', { dontQuote: true });
	return insert_query.toString();
};

module.exports = install_model;