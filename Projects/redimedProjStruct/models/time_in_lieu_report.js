module.exports = function(sequelize,DataTypes){
	var time_in_lieu_report = sequelize.define('time_in_lieu_report',{
	  time_time_in_lieu_id : {type: DataTypes.INTEGER(11), primaryKey: true },
	  FirstName: DataTypes.STRING(100),
	  LastName: DataTypes.STRING(100),
	  Empl_id: DataTypes.INTEGER(11),
	  Dept_id: DataTypes.INTEGER(11),
	  Dept_Name: DataTypes.STRING(100),
	  time_in_lieu: DataTypes.INTEGER(11),
	  user_id: DataTypes.INTEGER(11),
	  weekno: DataTypes.INTEGER(11),
	  start_date: DataTypes.DATE,
	  finish_date: DataTypes.DATE,
	  Creation_date : DataTypes.DATE ,
	  Last_update_date : DataTypes.DATE 
},{
	 tableName: 'time_in_lieu_report', // đặt tên bảng
	  createdAt: 'Creation_date',
      updatedAt: 'Last_update_date'
    });

    return time_in_lieu_report;
};