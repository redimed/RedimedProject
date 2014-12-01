module.exports = function(sequelize, DataTypes){
	var mdtWaitingList = sequelize.define("WaitingList", {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		reason: DataTypes.TEXT,
		priority: DataTypes.STRING(10),
		doctor_id: DataTypes.INTEGER(11),
		Patient_id: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Last_updated_by: DataTypes.INTEGER(11)
	}, {
		tableName: "cln_waiting_lists",
		createdAt: "Creation_date",
		updatedAt: "Last_update_date",
	});

	return mdtWaitingList;
}