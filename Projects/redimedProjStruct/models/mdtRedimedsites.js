module.exports = function(sequelize, DataTypes){
	 var mdtRedimedsites = sequelize.define('mdtRedimedsites', {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		Site_name: DataTypes.STRING(100),
		Site_addr: DataTypes.STRING(100),
		postcode: DataTypes.INTEGER(11),
		State: DataTypes.STRING(25),
		latitude: DataTypes.FLOAT,
		longitude: DataTypes.FLOAT,
		country: DataTypes.STRING(45),
		Available_def: DataTypes.INTEGER(11),
		booking_status: DataTypes.STRING(20),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
		isPreEmpBK: DataTypes.INTEGER(11),
	}, {
		tableName: 'redimedsites',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return mdtRedimedsites;
}