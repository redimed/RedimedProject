module.exports = function(sequelize, DataTypes){
	 var mdtOutdoctor = sequelize.define('mdtOutdoctor', {
		doctor_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		provider_no: DataTypes.STRING(100),
		name: DataTypes.STRING(100),
		address: DataTypes.STRING(200),
		suburb: DataTypes.STRING(100),
		state: DataTypes.STRING(100),
		phone: DataTypes.STRING(20),
		created_by: DataTypes.INTEGER(11),
		creation_date: DataTypes.DATE,
		last_updated_by: DataTypes.INTEGER(11),
		last_update_date: DataTypes.DATE,
	}, {
		tableName: 'outside_doctors',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return mdtOutdoctor;
}