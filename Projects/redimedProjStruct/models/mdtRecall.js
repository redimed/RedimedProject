module.exports = function(sequelize, DataTypes){
	 var mdtRecall = sequelize.define('mdtRecall', {
		recall_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		patient_id: DataTypes.INTEGER(11),
		notes: DataTypes.TEXT,
		transaction_date: DataTypes.DATE,
		recall_period: DataTypes.INTEGER(11),
		recall_date: DataTypes.DATE,
		remind_before: DataTypes.INTEGER(11),
		created_by: DataTypes.INTEGER(11),
		creation_date: DataTypes.DATE,
		last_updated_by: DataTypes.INTEGER(11),
		last_update_date: DataTypes.DATE
	}, {
		tableName: 'cln_recalls',
		createdAt: 'creation_date',
		updatedAt: 'last_update_date'
	});

	return mdtRecall;
}