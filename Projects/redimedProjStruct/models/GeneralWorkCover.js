module.exports = function(sequelize, DataTypes){
	 var GeneralWorkCover = sequelize.define('GeneralWorkCover', {
		id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
		cal_id: DataTypes.INTEGER(11),
		patient_id: DataTypes.INTEGER(11),
		injuryDate: DataTypes.DATE,
		Symptoms: DataTypes.STRING(200),
		vitalSigns: DataTypes.STRING(200),
		medicalHistory: DataTypes.STRING(200),
		medications: DataTypes.STRING(200),
		allergies: DataTypes.STRING(200),
		symptomology: DataTypes.STRING(200),
		examiantion: DataTypes.STRING(200),
		diffDiagnosis: DataTypes.STRING(200),
		medication: DataTypes.STRING(200),
		physio: DataTypes.STRING(200),
		dutyrestriction: DataTypes.STRING(200),
		recommendations: DataTypes.STRING(200),
		followup: DataTypes.STRING(200),
		referrals: DataTypes.STRING(200),
		telehealth_id: DataTypes.INTEGER(11),
		Name: DataTypes.STRING(100),
		Address: DataTypes.STRING(100),
		Email: DataTypes.STRING(100),
		registionNo: DataTypes.STRING(100),
		Phone: DataTypes.STRING(15),
		examDate: DataTypes.DATE,
		signature: DataTypes.TEXT,
		reportlocal: DataTypes.STRING(30),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
		AssessmentName: DataTypes.STRING(50),
	}, {
		tableName: 'th_general_assessment',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date',
        classMethods: {
            associate: function(models) {
                GeneralWorkCover.belongsTo(models.Appointment, { 
                    as: 'Appointment',
                    foreignKey: 'cal_id'
                });
                GeneralWorkCover.belongsTo(models.User, { 
                    as: 'User',
                    foreignKey: 'Created_by'
                });
            }
        }
	});

	return GeneralWorkCover;
}