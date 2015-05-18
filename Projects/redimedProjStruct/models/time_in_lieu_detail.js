module.exports = function(sequelize,DataTypes){
    var time_in_lieu_detail = sequelize.define('time_in_lieu_detail',{
        task_week_id: {type:DataTypes.INTEGER(11), primaryKey:true},
        user_id :DataTypes.INTEGER(11),
        item_id: DataTypes.INTEGER(11),
        Employee_id : DataTypes.INTEGER(11) ,
        Department_id : DataTypes.INTEGER(11) ,
        weekno : DataTypes.INTEGER(11) ,
        time_in_lieu_used : DataTypes.INTEGER(11) ,
        time_in_lieu_week :DataTypes.INTEGER(11),
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'time_in_lieu_detail', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return time_in_lieu_detail;
};