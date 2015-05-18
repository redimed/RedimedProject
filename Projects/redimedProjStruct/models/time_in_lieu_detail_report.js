module.exports = function(sequelize,DataTypes){
    var time_in_lieu_detail_report = sequelize.define('time_in_lieu_detail_report',{
        id: {type:DataTypes.INTEGER(11), primaryKey:true},
        user_id :DataTypes.INTEGER(11),
        Employee_id : DataTypes.INTEGER(11) ,
        Department_id : DataTypes.INTEGER(11) ,
        time_in_lieu_remain_all : DataTypes.INTEGER(11),
        time_in_lieu_used_all :DataTypes.INTEGER(11),  
        time_in_lieu_week_all :DataTypes.INTEGER(11),     
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        time_in_lieu_remain_Dept:DataTypes.INTEGER(11),
        time_in_lieu_remain_total:DataTypes.INTEGER(11),
        time_in_lieu_used_Dept:DataTypes.INTEGER(11),
        time_in_lieu_used_total:DataTypes.INTEGER(11),
        time_in_lieu_week_Dept:DataTypes.INTEGER(11),
        time_in_lieu_week_total:DataTypes.INTEGER(11),
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'time_in_lieu_detail_report', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return time_in_lieu_detail_report;
};