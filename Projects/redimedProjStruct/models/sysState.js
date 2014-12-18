module.exports = function(sequelize, DataTypes){
	 var sysState = sequelize.define('sysState', {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		State: DataTypes.STRING(50),
		Country_name: DataTypes.STRING(50),
		Isenable: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'sys_states',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return sysState;
}