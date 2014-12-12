module.exports = function(sequelize, DataTypes){
	 var mdtDept = sequelize.define('mdtDept', {
		CLINICAL_DEPT_ID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		CLINICAL_DEPT_NAME: DataTypes.STRING(200),
		ISENABLE: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'cln_clinical_depts',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return mdtDept;
}