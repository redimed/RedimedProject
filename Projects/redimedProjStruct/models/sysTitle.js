module.exports = function(sequelize, DataTypes){
	 var sysTitle = sequelize.define('sysTitle', {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		name: DataTypes.STRING(10),
		Isenable: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'sys_titles',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return sysTitle;
}