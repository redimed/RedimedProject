module.exports = function(sequelize,DataTypes){
	var ph_companies = sequelize.define('ph_companies',{
		company_id:{type:DataTypes.INTEGER, primaryKey: true},
		company_name:DataTypes.STRING(200),
		address:DataTypes.STRING(200),
		surburb: DataTypes.STRING(50) ,
		postcode:DataTypes.INTEGER ,
		state: DataTypes.STRING(50) ,
		country: DataTypes.STRING (50) ,
		contact_name: DataTypes.STRING(50) ,
		contact_number: DataTypes.STRING(15) ,
		email: DataTypes.STRING(50) ,
		phone: DataTypes.STRING(15) ,
		mobile: DataTypes.STRING(15) ,
		isCompouding: DataTypes.INTEGER ,
		isCPOP: DataTypes.INTEGER ,
		Dispensing_software: DataTypes.STRING(50) ,
		isMutiShops: DataTypes.INTEGER ,
		CREATED_BY: DataTypes.INTEGER  ,
		CREATION_DATE:DataTypes.DATE,
		LAST_UPDATED_BY: DataTypes.INTEGER  ,
		LAST_UPDATE_DATE: DataTypes.DATE
	},{
		tableName: 'ph_companies', 
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
	});
	return ph_companies;
}