module.exports = function(sequelize, DataTypes){
	var mdtAppointment = sequelize.define("mdtAppointment", {
		CAL_ID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		DOCTOR_ID: DataTypes.INTEGER(11),
		SITE_ID: DataTypes.INTEGER(11),
		FROM_TIME: DataTypes.DATE,
		TO_TIME: DataTypes.DATE,
		NOTES: DataTypes.STRING(50),
		PHONE: DataTypes.STRING(20),
		APP_TYPE: DataTypes.STRING(10),
		STATUS: DataTypes.STRING(20),
		ARR_TIME: DataTypes.DATE,
		ATTEND_TIME: DataTypes.DATE,
		AVAILABLE: DataTypes.INTEGER(11),
		Patient_id: DataTypes.BIGINT(11),
		SERVICE_ID: DataTypes.INTEGER(11),
		CLINICAL_DEPT_ID: DataTypes.INTEGER(11),
		ACC_TYPE: DataTypes.STRING(10),
		bill_to: DataTypes.INTEGER(11),
		PATIENTS: DataTypes.TEXT
	}, {
		tableName: "cln_appointment_calendar",
		timestamps: false,
		classMethods: {
			associate: function(models){
				mdtAppointment.belongsTo(models.mdtPatient, 
					{as: 'Patient', foreignKey: 'Patient_id'}
				);
			}
		}// end association
	});

	return mdtAppointment;
}