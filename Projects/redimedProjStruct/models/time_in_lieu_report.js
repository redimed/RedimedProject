module.exports = function(sequelize,DataTypes){
    var time_in_lieu_report = sequelize.define('time_in_lieu_report',{
        time_in_lieu_id: {type:DataTypes.INTEGER(11), primaryKey:true},
        create_id :DataTypes.INTEGER(11),
        Employee_id : DataTypes.INTEGER(11) ,
        Department_id : DataTypes.INTEGER(11) ,
        time_in_lieu : DataTypes.INTEGER(11) ,
        time_in_lieu_used: DataTypes.INTEGER(11),
        time_in_lieu_remain: DataTypes.INTEGER(11),
        time_in_lieu_gan_nhat: DataTypes.INTEGER(11),
        time_in_lieu_Dept:  DataTypes.INTEGER(11),
        time_in_lieu_used_Dept:  DataTypes.INTEGER(11),
        time_in_lieu_remain_Dept: DataTypes.INTEGER(11),
        time_in_lieu_gan_nhat_Dept: DataTypes.INTEGER(11),
        time_in_lieu_all:  DataTypes.INTEGER(11),
        time_in_lieu_used_all:  DataTypes.INTEGER(11),
        time_in_lieu_remain_all:  DataTypes.INTEGER(11),
        time_in_lieu_gan_nhat_all:  DataTypes.INTEGER(11),
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