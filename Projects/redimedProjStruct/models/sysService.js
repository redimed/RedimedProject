module.exports = function(sequelize, DataTypes){
	 var sysService = sequelize.define('sysService', {
		SERVICE_ID: DataTypes.INTEGER(11),
		SERVICE_NAME: DataTypes.STRING(50),
		DESCRIPTION: DataTypes.STRING(250),
		Isenable: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'sys_services',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return sysService;
}