module.exports = function(sequelize, DataTypes){
	 var Referral = sequelize.define('Referral', {
		ID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		Patient_id: DataTypes.INTEGER(11),
		CAL_ID: DataTypes.INTEGER(11),
		IS_CT_SCAN: DataTypes.INTEGER(11),
		IS_X_RAY: DataTypes.INTEGER(11),
		IS_MRI: DataTypes.INTEGER(11),
		IS_ULTRASOUND: DataTypes.INTEGER(11),
		IS_PATHOLOGY: DataTypes.INTEGER(11),
		CLINICAL_DETAILS: DataTypes.STRING(600),
		IS_ALLERGIES: DataTypes.INTEGER(11),
		REQUESTING_PRACTITIONER: DataTypes.STRING(300),
		IS_REPORT_URGENT: DataTypes.INTEGER(11),
		IS_ELECTRONIC: DataTypes.INTEGER(11),
		IS_FAX: DataTypes.INTEGER(11),
		IS_Email: DataTypes.STRING(100),
		IS_PHONE: DataTypes.INTEGER(11),
		IS_RETURN_WITH_PATIENT: DataTypes.INTEGER(11),
		APPOINTMENT_DATE: DataTypes.DATE,
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
		Isenable: DataTypes.INTEGER(11),
	}, {
		tableName: 'cln_redimed_referral',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return Referral;
}