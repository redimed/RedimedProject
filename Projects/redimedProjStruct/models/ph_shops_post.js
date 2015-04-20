module.exports = function(sequelize,DataTypes){
	var ph_shops_post = sequelize.define('ph_shops_post',{
		post_id: {type:DataTypes.INTEGER,primaryKey:true},
		shop_id: {type:DataTypes.INTEGER,primaryKey:true},
		CREATED_BY: DataTypes.INTEGER  ,
		CREATION_DATE: DataTypes.DATE  ,
		LAST_UPDATED_BY: DataTypes.INTEGER  ,
		LAST_UPDATE_DATE: DataTypes.DATE  ,
	},{
		tableName: 'ph_shops_post', 
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
	})
	return ph_shops_post;
}