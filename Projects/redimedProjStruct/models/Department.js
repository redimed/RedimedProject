module.exports = function(sequelize, DataTypes){
	 var Department = sequelize.define('Department', {
		departmentid: DataTypes.INTEGER(11),
		departmentName: DataTypes.STRING(100),
		locationID: DataTypes.INTEGER(11),
		managerId: DataTypes.INTEGER(11),
	}, {
		tableName: 'departments',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return Department;
}