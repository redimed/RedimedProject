module.exports= function(sequelize,DataTypes){
	var ph_users = sequelize.define('ph_users',{
		user_id:{type:DataTypes.INTEGER, primaryKey: true},
		username:DataTypes.STRING(50),
		PASSWORD:DataTypes.STRING(500),
		user_type:DataTypes.STRING(50),
		firstname:DataTypes.STRING(50),
		surname:DataTypes.STRING(50),
		mobile:DataTypes.STRING(20),
		email:DataTypes.STRING(50),
		CREATED_BY: DataTypes.INTEGER(11) ,
		CREATION_DATE:DataTypes.DATE ,
		LAST_UPDATED_BY:DataTypes.INTEGER(11),
		LAST_UPDATE_DATE: DataTypes.DATE
	},{
		tableName: 'ph_users', 
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
	});
	return ph_users;
};