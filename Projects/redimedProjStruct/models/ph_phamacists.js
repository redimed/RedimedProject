module.exports = function(sequelize,DataTypes){
	var ph_phamacists = sequelize.define('ph_phamacists',{
		phamacist_id: {type:DataTypes.INTEGER,primaryKey:true},
		surname: DataTypes.STRING(20) ,
		firstname: DataTypes.STRING(20) ,
		DOB: DataTypes.DATE ,
		email: DataTypes.STRING(20) ,
		phone: DataTypes.STRING(15) ,
		mobile: DataTypes.STRING(15) ,
		address: DataTypes.STRING(200) ,
		surburb: DataTypes.STRING(50) ,
		postcpde: DataTypes.INTEGER ,
		state: DataTypes.STRING(50) ,
		country: DataTypes.STRING(50) ,
		gender: DataTypes.STRING(20) ,
		preferred_name: DataTypes.STRING(50) ,
		user_id: DataTypes.INTEGER ,
		APHRA: DataTypes.STRING(50) ,
		Proficient: DataTypes.STRING(50) ,
		isHMR: DataTypes.INTEGER ,
		isCPOP: DataTypes.INTEGER ,
		isCompounding: DataTypes.INTEGER,
		CREATED_BY: DataTypes.INTEGER ,
		CREATION_DATE: DataTypes.DATE ,
		LAST_UPDATED_BY: DataTypes.INTEGER ,
		LAST_UPDATE_DATE: DataTypes.DATE  
	},{
		tableName: 'ph_phamacists', 
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
	});
	return ph_phamacists;
};