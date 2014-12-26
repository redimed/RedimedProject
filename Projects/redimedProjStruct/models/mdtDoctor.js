module.exports = function(sequelize, DataTypes){
	 var mdtDoctor = sequelize.define('mdtDoctor', {
		doctor_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		NAME: DataTypes.STRING(100),
		Address: DataTypes.STRING(100),
		Email: DataTypes.STRING(100),
		User_id: DataTypes.INTEGER(11),
		Provider_no: DataTypes.STRING(100),
		Phone: DataTypes.STRING(15),
		Signature: DataTypes.TEXT,
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
		isReceiveEmailAfterHour: DataTypes.INTEGER(11),
		Title: DataTypes.STRING(10),
		First_name: DataTypes.STRING(30),
		Middle_name: DataTypes.STRING(30),
		Sur_name: DataTypes.STRING(50),
		Qualification_id: DataTypes.INTEGER(11),
		Prescriber_no: DataTypes.INTEGER(11),
		Sign_off: DataTypes.STRING(50),
		Payee_provider_no: DataTypes.INTEGER(11),
		ABN_no: DataTypes.INTEGER(11),
		Provider_type: DataTypes.INTEGER(11),
		Specialty_id: {
			type: DataTypes.INTEGER(11),
			references: "cln_specialties",
			referencesKey: "Specialties_id"
		},
		Default_bank_account_id: DataTypes.INTEGER(11),
		Medical_Registration_no: DataTypes.INTEGER(11),
		OSHC_ID: DataTypes.INTEGER(11),
		isAppointmentBook: DataTypes.INTEGER(11),
		isMonday: DataTypes.INTEGER(11),
		isTuesday: DataTypes.INTEGER(11),
		isWednesday: DataTypes.INTEGER(11),
		isThursday: DataTypes.INTEGER(11),
		isFriday: DataTypes.INTEGER(11),
		isSaturday: DataTypes.INTEGER(11),
		isSunday: DataTypes.INTEGER(11),
		Appt_interval: DataTypes.INTEGER(11),
		Isenable: DataTypes.INTEGER(11),
		CLINICAL_DEPT_ID: DataTypes.INTEGER(11),
		isNewCalendarSlot: DataTypes.INTEGER(11),
	}, {
		tableName: 'doctors',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date',
		classMethods: {
            associate: function(models) {
            	mdtDoctor.hasMany(models.mdtSpecialty, {
            		as: 'Specialties',
            		foreignKey: 'doctor_id',
            		through: 'doctor_specialities'
            	});
            }
        }//end classMedthods
	});

	return mdtDoctor;
}