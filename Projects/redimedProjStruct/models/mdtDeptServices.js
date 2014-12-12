module.exports = function(sequelize, DataTypes){
	 var DeptServices = sequelize.define('DeptServices', {
		CLINICAL_DEPT_ID:{
			type: DataTypes.INTEGER(11),
			primaryKey:true,
		},
		SERVICE_ID:{
			type: DataTypes.INTEGER(11),
			primaryKey:true,
		},
		'ISENABLE': { 
            type: DataTypes.INTEGER(11),  
            defaultValue: 1,
        },
		Created_by: DataTypes.INTEGER(11),
		Last_updated_by: DataTypes.INTEGER(11),
	}, {
		tableName: 'cln_dept_services',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date'
	});

	return DeptServices;
}