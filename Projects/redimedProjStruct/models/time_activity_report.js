module.exports = function(sequelize,DataTypes){
    var time_activity_report = sequelize.define('time_activity_report',{
        id: {type:DataTypes.INTEGER(11), primaryKey:true},
        user_id :DataTypes.INTEGER(11),       
        Employee_id : DataTypes.INTEGER(11) ,
        Department_id : DataTypes.INTEGER(11) ,
        time_charge_1        : DataTypes.INTEGER(11) ,
        time_charge_1_Dept   : DataTypes.INTEGER(11),
        time_charge_1_all    : DataTypes.INTEGER(11),
        time_charge_2        : DataTypes.INTEGER(11) ,
        time_charge_2_Dept   : DataTypes.INTEGER(11),
        time_charge_2_all    : DataTypes.INTEGER(11),
        time_charge_3        : DataTypes.INTEGER(11) ,
        time_charge_3_Dept   : DataTypes.INTEGER(11),
        time_charge_3_all    : DataTypes.INTEGER(11),
        time_charge_4        : DataTypes.INTEGER(11) ,
        time_charge_4_Dept   : DataTypes.INTEGER(11),
        time_charge_4_all    : DataTypes.INTEGER(11),
        time_charge_5        : DataTypes.INTEGER(11) ,
        time_charge_5_Dept   : DataTypes.INTEGER(11),
        time_charge_5_all    : DataTypes.INTEGER(11),
        time_charge_week     : DataTypes.INTEGER(11) ,
        time_charge_week_Dept: DataTypes.INTEGER(11),
        time_charge_all      : DataTypes.INTEGER(11),
        weekno : DataTypes.INTEGER(11) ,
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'time_activity_report', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return time_activity_report;
};