module.exports = function(sequelize,DataTypes){
    var time_activity_summary_report = sequelize.define('time_activity_summary_report',{
        id: {type:DataTypes.INTEGER(11), primaryKey:true},
        user_id: DataTypes.INTEGER(11),
        Department_id : DataTypes.INTEGER(11) ,
        activity_id   : DataTypes.INTEGER(11),
        time_charge_Dept: DataTypes.INTEGER(11),
        time_charge_Dept_per : DataTypes.FLOAT,
        time_charge_Dept_all: DataTypes.INTEGER(11),
        time_charge_all      : DataTypes.INTEGER(11),
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        Creation_date : DataTypes.DATE ,
        Creation_by :DataTypes.INTEGER(11),
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'time_activity_summary_report', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return time_activity_summary_report;
};