module.exports = function(sequelize, DataTypes){
	 var sysCountry = sequelize.define('sysCountry', {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		Country_name: DataTypes.STRING(50),
		Isenable: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'sys_countries',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return sysCountry;
}