module.exports = function(sequelize,DataTypes){
    var Calendar = sequelize.define('Calendar',{
        site_id : DataTypes.INTEGER(11) ,
        cal_id : {type:DataTypes.INTEGER(11), primaryKey:true},
        From_time : DataTypes.DATE ,
        to_time : DataTypes.DATE ,
        available : DataTypes.INTEGER(11) ,
        booking : DataTypes.INTEGER(11) ,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE 
    },{
        tableName: 'calendar', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return Calendar;
};	