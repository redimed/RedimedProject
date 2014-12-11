module.exports = function(sequelize, DataTypes){
	 var mdtSpecialty = sequelize.define('mdtSpecialty', {
		Specialties_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		Specialties_name: DataTypes.STRING(50),
		Isenable: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
		RL_TYPE_ID: DataTypes.INTEGER(11)
	}, {
		tableName: 'cln_specialties',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date',
		classMethods: {
            associate: function(models) {
            	mdtSpecialty.hasMany(models.mdtDoctor, {
            		as: 'Doctors',
            		foreignKey: 'Specialties_id',
            		through: 'doctor_specialities'
            	});

            	mdtSpecialty.belongsTo(models.sysrlTypes, {
            		as: "RLType",
            		foreignKey: 'RL_TYPE_ID'
            	});
            }
        }//end classMedthods
	});

	return mdtSpecialty;
}