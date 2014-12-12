module.exports = function(sequelize, DataTypes){
	 var SysServices = sequelize.define('SysServices', {
		SERVICE_ID: {
            type: DataTypes.INTEGER(11),
            primaryKey:true,
            autoIncrement:true
        },
		SERVICE_NAME: DataTypes.STRING(50),
		DESCRIPTION: DataTypes.STRING(250),
		SERVICE_COLOR: DataTypes.STRING(10),
		Isenable: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'sys_services',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date',
		classMethods: {
            associate: function (models) {
                
                SysServices.hasMany(models.Department, {
                    as: 'Departments',
                    foreignKey: 'SERVICE_ID', 
                    through: models.DeptServices,
                    // through: 'cln_dept_services',
                });
            }
        }
	});

	return SysServices;
}