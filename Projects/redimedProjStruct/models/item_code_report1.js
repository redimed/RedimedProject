module.exports = function(sequelize,DataTypes){
    var item_code_report1 = sequelize.define('item_code_report1',{
        id: {type:DataTypes.INTEGER(11), primaryKey:true},
        user_id :DataTypes.INTEGER(11),
        Employee_id : DataTypes.INTEGER(11) ,
        Department_id : DataTypes.INTEGER(11) ,
        item_id :DataTypes.STRING(100),
        total_numbers :DataTypes.INTEGER(11),
        total_numbers_Dept:DataTypes.INTEGER(11),
        total_numbers_all :DataTypes.INTEGER(11),
        total_items: DataTypes.INTEGER(11),
        total_items_Dept: DataTypes.INTEGER(11),
        time_charge_items: DataTypes.INTEGER(11),
        time_charge_average: DataTypes.FLOAT,
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        Creation_date : DataTypes.DATE ,
        Creation_by  : DataTypes.INTEGER(11),
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'item_code_report1', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return item_code_report1;
};