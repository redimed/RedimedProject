module.exports = function(sequelize,DataTypes){
	var ph_post_cadidates = sequelize.define('ph_post_cadidates',{
		post_id: {type:DataTypes.INTEGER,primaryKey:true},
		phamacist_id: {type:DataTypes.INTEGER,primaryKey:true},
		isSelect: DataTypes.INTEGER ,
		CREATED_BY: DataTypes.INTEGER  ,
		CREATION_DATE: DataTypes.DATE  ,
		LAST_UPDATED_BY: DataTypes.INTEGER  ,
		LAST_UPDATE_DATE: DataTypes.DATE  ,
	},{
		tableName: 'ph_post_cadidates', 
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
	});
	return ph_post_cadidates;
};