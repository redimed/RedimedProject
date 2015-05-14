module.exports = function(sequelize,DataTypes){
	var time_in_lieu_detail_report = sequelize.define('time_in_lieu_detail_report',{
	  user_id : {type: DataTypes.INTEGER(11), primaryKey: true },
	  Employee_id: DataTypes.INTEGER(11),
	  Department_id: DataTypes.INTEGER(11),
	  time_in_lieu_weeks: DataTypes.INTEGER(11),
	  time_in_lieu_Dept: DataTypes.INTEGER(11),
	  time_in_lieu_total: DataTypes.INTEGER(11),
	  start_date: DataTypes.DATE,
	  finish_date: DataTypes.DATE,
	  Creation_date : DataTypes.DATE ,
	  Last_update_date : DataTypes.DATE 
},{
	 tableName: 'time_in_lieu_detail_report', // đặt tên bảng
	  createdAt: 'Creation_date',
      updatedAt: 'Last_update_date'
    });

    return time_in_lieu_detail_report;
};