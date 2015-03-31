module.exports = function(sequelize,DataTypes){
	var ph_company_shops = sequelize.define('ph_company_shops',{
		shop_id: {type:DataTypes.INTEGER,primaryKey:true},
		company_id: DataTypes.INTEGER ,
		shop_name: DataTypes.STRING(50) ,
		address: DataTypes.STRING(200) ,
		suburb: DataTypes.STRING(50) ,
		postcode: DataTypes.INTEGER ,
		state: DataTypes.STRING(50) ,
		phone: DataTypes.STRING(15) ,
		CREATED_BY: DataTypes.INTEGER  ,
		CREATION_DATE: DataTypes.DATE  ,
		LAST_UPDATED_BY: DataTypes.INTEGER  ,
		LAST_UPDATE_DATE: DataTypes.DATE  
	},{
		tableName: 'ph_company_shops', 
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
	});
	return ph_company_shops;
};