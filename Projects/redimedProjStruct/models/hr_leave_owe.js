module.exports = function(sequelize,DataTypes){
    var hr_leave_owe = sequelize.define('hr_leave_owe',{
        id: {type:DataTypes.INTEGER(11), primaryKey:true},
        create_id: DataTypes.INTEGER(11),
        user_id :DataTypes.INTEGER(11),
        department: DataTypes.INTEGER(11),
        date_leave : DataTypes.DATE ,
        isReject: DataTypes.INTEGER(11),
        employee : DataTypes.INTEGER(11) ,
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        Creation_date : DataTypes.DATE ,
        created_by  : DataTypes.INTEGER(11),
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'hr_leave_owe', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return hr_leave_owe;
};