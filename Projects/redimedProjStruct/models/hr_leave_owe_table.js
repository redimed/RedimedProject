module.exports = function(sequelize,DataTypes){
    var hr_leave_owe_table = sequelize.define('hr_leave_owe_table',{
        id: {type:DataTypes.INTEGER(11), primaryKey:true},
        create_id :DataTypes.INTEGER(11),
        user_id :DataTypes.INTEGER(11),
        task_week_id: DataTypes.INTEGER(11),
        Employee_id : DataTypes.INTEGER(11) ,
        Department_id : DataTypes.INTEGER(11) ,
        FirstName: DataTypes.STRING(100),
        LastName: DataTypes.STRING(100),
        Department_name: DataTypes.STRING(100),
        weekno : DataTypes.INTEGER(11) ,
        
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        Creation_date : DataTypes.DATE ,
        Creation_by  : DataTypes.INTEGER(11),
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'hr_leave_owe_table', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return hr_leave_owe_table;
};