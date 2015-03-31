module.exports = function(sequelize,DataTypes){
	var ph_phamacist_qualifications = sequelize.define('ph_phamacist_qualifications',{
		qualification_id:{type:DataTypes.INTEGER,primaryKey:true},
		qualification: DataTypes.STRING(50) ,
		phamacist_id:DataTypes.INTEGER ,
		CREATED_BY:DataTypes.INTEGER ,
		CREATION_DATE:DataTypes.DATE ,
		LAST_UPDATED_BY:DataTypes.INTEGER ,
		LAST_UPDATE_DATE:DataTypes.DATE
	},{
		tableName: 'ph_phamacist_qualifications', 
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
	});
	return ph_phamacist_qualifications;
};