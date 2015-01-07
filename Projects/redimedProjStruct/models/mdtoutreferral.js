module.exports = function(sequelize, DataTypes){
	 var mdtoutreferral = sequelize.define('mdtoutreferral', {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		date_issued: DataTypes.DATE,
		date_started: DataTypes.DATE,
		duration: DataTypes.INTEGER(11),
		expire_date: DataTypes.DATE,
		referred_to_doctor: DataTypes.INTEGER(11),
		doctor_id: DataTypes.INTEGER(11),
		patient_id: DataTypes.INTEGER(11),
		created_by: DataTypes.INTEGER(11),
		creation_date: DataTypes.DATE,
		last_updated_by: DataTypes.INTEGER(11),
		last_update_date: DataTypes.DATE,
	}, {
		tableName: 'outside_referrals',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date',
		classMethods: {
            associate: function(models) {
                mdtoutreferral.belongsTo(models.Doctor, { 
                	as: 'ReferredDoctor', 
                	foreignKey: 'referred_to_doctor'
                });

                mdtoutreferral.belongsTo(models.mdtOutdoctor, { 
                	as: 'OutDoctor', 
                	foreignKey: 'doctor_id'
                });
            }
        }
	});

	return mdtoutreferral;
}