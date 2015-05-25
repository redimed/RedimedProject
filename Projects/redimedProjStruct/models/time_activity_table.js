module.exports = function(sequelize,DataTypes){
    var time_activity_table = sequelize.define('time_activity_table',{
        time_activity_id: {type:DataTypes.INTEGER(11), primaryKey:true},
        user_id :DataTypes.INTEGER(11),
        task_week_id: DataTypes.INTEGER(11),
        Employee_id : DataTypes.INTEGER(11) ,
        Department_id : DataTypes.INTEGER(11) ,
        FirstName: DataTypes.STRING(100),
        LastName: DataTypes.STRING(100),
        Department_name: DataTypes.STRING(100),
        weekno : DataTypes.INTEGER(11) ,
        time_charge_week : DataTypes.INTEGER(11) ,
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        Creation_date : DataTypes.DATE ,
        Creation_by : DataTypes.INTEGER(11),
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'time_activity_table', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return time_activity_table;
};