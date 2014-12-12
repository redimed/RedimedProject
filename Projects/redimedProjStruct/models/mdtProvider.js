module.exports = function(sequelize, DataTypes){
	 var mdtProvider = sequelize.define('mdtProvider', {
		Provider_types_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		Provider_types_name: DataTypes.STRING(50),
		Isenable: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'cln_provider_types',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return mdtProvider;
}