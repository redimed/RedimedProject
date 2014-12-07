module.exports = function(sequelize, DataTypes){
	 var mdtDeptItemList = sequelize.define('DeptHeaders', {
		CLINICAL_DEPT_ID: DataTypes.INTEGER(11),
		POPULAR_HEADER_ID: DataTypes.INTEGER(11),
		isDefault: DataTypes.INTEGER(11),
		ISENABLE: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
		ISENABLE: {
			type: DataTypes.INTEGER(1),
			defaultValue: 1,
		}
	}, {
		tableName: 'cln_dept_item_lists',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date',
		paranoid: true,
        deletedAt: "ISENABLE"
	});

	return mdtDeptItemList;
}