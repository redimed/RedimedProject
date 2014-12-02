module.exports = function(sequelize, DataTypes){
	 var Script = sequelize.define('Script', {
		ID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		Patient_id: DataTypes.INTEGER(11),
		CAL_ID: DataTypes.INTEGER(11),
		prescriber: DataTypes.STRING(50),
		scriptNum: DataTypes.INTEGER(20),
		Medicare: DataTypes.STRING(100),
		isRefNo: DataTypes.INTEGER(11),
		EntitlementNo: DataTypes.STRING(100),
		isSafety: DataTypes.INTEGER(11),
		isConcessional: DataTypes.INTEGER(11),
		isPBS: DataTypes.INTEGER(11),
		isRPBS: DataTypes.INTEGER(11),
		isBrand: DataTypes.INTEGER(11),
		pharmacist: DataTypes.STRING(400),
		doctorSign: DataTypes.TEXT,
		doctordate: DataTypes.DATE,
		patientSign: DataTypes.TEXT,
		patientDate: DataTypes.DATE,
		agentAddress: DataTypes.STRING(150),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'cln_scripts',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return Script;
}