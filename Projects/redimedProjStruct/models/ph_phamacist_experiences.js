module.exports = function(sequelize,DataTypes){
	var ph_phamacist_experiences = sequelize.define('ph_phamacist_experiences',{
		exp_id :{type:DataTypes.INTEGER,primaryKey:true},
		phamacist_id: DataTypes.INTEGER ,
		from_date: DataTypes.DATE ,
		to_date: DataTypes.DATE ,
		company: DataTypes.STRING(50) ,
		POSITION: DataTypes.STRING(50) ,
		reference_name: DataTypes.STRING(50) ,
		reference_contact: DataTypes.STRING(50) ,
		duty: DataTypes.STRING(50) ,
		CREATED_BY:DataTypes.INTEGER ,
		CREATION_DATE:DataTypes.DATE ,
		LAST_UPDATED_BY:DataTypes.INTEGER ,
		LAST_UPDATE_DATE:DataTypes.DATE
	},{
		tableName: 'ph_phamacist_experiences', 
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
	});
	return ph_phamacist_experiences;
};