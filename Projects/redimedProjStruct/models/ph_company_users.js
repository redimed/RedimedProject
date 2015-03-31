module.exports = function(sequelize,DataTypes){
	var ph_company_users = sequelize.define('ph_company_users',{
		company_id: {type:DataTypes.INTEGER,primaryKey:true},
		user_id: {type:DataTypes.INTEGER,primaryKey:true},
		isMain: DataTypes.INTEGER ,
		isEnable: DataTypes.INTEGER ,
		CREATED_BY: DataTypes.INTEGER  ,
		CREATION_DATE: DataTypes.DATE  ,
		LAST_UPDATED_BY: DataTypes.INTEGER  ,
		LAST_UPDATE_DATE: DataTypes.DATE  ,
	},{
		tableName: 'ph_company_users', 
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
	})
	return ph_company_users;
}