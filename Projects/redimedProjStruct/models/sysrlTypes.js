module.exports = function(sequelize, DataTypes){
	 var sysrlTypes = sequelize.define('sysrlTypes', {
		RL_TYPE_ID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		Rl_TYPE_NAME: DataTypes.STRING(50),
		ISENABLE: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'rl_types',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date',
		classMethods: {
            associate: function(models) {
            	sysrlTypes.hasOne(models.mdtSpecialty, {
            		as: "Specialty",
            		foreignKey: 'RL_TYPE_ID'
            	});
            }
        }//end classMedthods
	});

	return sysrlTypes;
}