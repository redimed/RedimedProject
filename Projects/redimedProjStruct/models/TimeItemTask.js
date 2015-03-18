/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var TimeItemTask = sequelize.define('TimeItemTask',{
        task_id : {type: DataTypes.INTEGER(11), primaryKey: true} ,
        item_id: DataTypes.STRING(20),
        quantity: DataTypes.INTEGER(11),
        time_charge: DataTypes.FLOAT,
        comment: DataTypes.TEXT,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE,
        deleted: DataTypes.INTEGER(1),
        isenable: DataTypes.INTEGER(1)
    },{
        tableName: 'time_item_task', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return TimeItemTask;
};