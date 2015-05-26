module.exports = function(sequelize,DataTypes){
    var time_in_lieu_report = sequelize.define('time_in_lieu_report',{
        time_in_lieu_id: {type:DataTypes.INTEGER(11), primaryKey:true},
        FirstName : DataTypes.STRING(100),
        LastName : DataTypes.STRING(100),
        task_week_id: DataTypes.INTEGER(11),
        Employee_id : DataTypes.INTEGER(11) ,
        Department_id : DataTypes.INTEGER(11) ,
        Department_name : DataTypes.STRING(100) ,
        weekno : DataTypes.INTEGER(11) ,
        time_in_lieu : DataTypes.INTEGER(11) ,
        time_charge :DataTypes.INTEGER(11),
        user_id :DataTypes.INTEGER(11),
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        Creation_date : DataTypes.DATE ,
        Creation_by : DataTypes.INTEGER(11),
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'time_in_lieu_report', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return time_in_lieu_report;
};