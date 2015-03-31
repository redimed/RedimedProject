module.exports = function(sequelize,DataTypes){
	var ph_posts = sequelize.define('ph_posts',{
		post_id: {type:DataTypes.INTEGER,primaryKey:true},
		company_id: DataTypes.INTEGER , 
		required_date: DataTypes.DATE ,
		time_od_shift: DataTypes.STRING(20) ,
		shop_id: DataTypes.INTEGER ,
		local_weekday_rate: DataTypes.STRING(20) ,
		nonelocal_weekday_rate: DataTypes.STRING(20) ,
		sat_rate: DataTypes.STRING(20) ,
		sun_rate: DataTypes.STRING(20) ,
		ph_rate: DataTypes.STRING(20) ,
		isTravel: DataTypes.INTEGER ,
		isAccommodation: DataTypes.INTEGER ,
		post_type: DataTypes.STRING(20) ,
		job_title: DataTypes.STRING(20) ,
		job_description: DataTypes.STRING(20) ,
		Start_date: DataTypes.DATE ,
		Duration: DataTypes.STRING(50) ,
		job_type: DataTypes.STRING(50) ,
		Qualification: DataTypes.STRING(20) ,
		experiences_require: DataTypes.STRING(20) ,
		hours_per_week: DataTypes.STRING(20) ,
		days_per_week: DataTypes.INTEGER ,
		isweekend_shift: DataTypes.INTEGER ,
		CREATED_BY: DataTypes.INTEGER  ,
		CREATION_DATE: DataTypes.DATE  ,
		LAST_UPDATED_BY: DataTypes.INTEGER  ,
		LAST_UPDATE_DATE: DataTypes.DATE  
	},{
		tableName: 'ph_posts', 
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
	});
	return ph_posts;
};