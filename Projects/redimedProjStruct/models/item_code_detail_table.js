module.exports = function(sequelize,DataTypes){
    var item_code_detail_table = sequelize.define('item_code_detail_table',{
        task_week_id: {type:DataTypes.INTEGER(11), primaryKey:true},
        tasks_id: DataTypes.INTEGER(11),
        user_id :DataTypes.INTEGER(11),
        item_id :DataTypes.INTEGER(11),
        Employee_id : DataTypes.INTEGER(11) ,
        Department_id : DataTypes.INTEGER(11) ,
        weekno : DataTypes.INTEGER(11) ,
        time_charge : DataTypes.INTEGER(11) ,
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        Creation_date : DataTypes.DATE ,
        Creation_by  : DataTypes.INTEGER(11),
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'item_code_detail_table', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return item_code_detail_table;
};