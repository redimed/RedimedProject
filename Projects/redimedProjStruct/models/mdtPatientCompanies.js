module.exports = function(sequelize, DataTypes){
	var mdtInstance = sequelize.define("PatientCompanies", {
		'patient_id': {  primaryKey: true, type: DataTypes.INTEGER(11)},
		'company_id': {  primaryKey: true, type: DataTypes.INTEGER(11)},
	}, {
		tableName: "patient_companies",
	});
	return mdtInstance;
}