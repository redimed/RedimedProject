module.exports = function(sequelize,DataTypes){
    var item_code_report = sequelize.define('item_code_report',{
        id: {type:DataTypes.INTEGER(11), primaryKey:true},
        user_id :DataTypes.INTEGER(11),
        Employee_id : DataTypes.INTEGER(11) ,
        Department_id : DataTypes.INTEGER(11) ,
        item_id :DataTypes.STRING(20),
        item_id_count :DataTypes.INTEGER(11),
        time_charge_all:DataTypes.INTEGER(11),
        from_date :DataTypes.DATE,
        to_date:DataTypes.DATE,
        total_item_Empl: DataTypes.INTEGER(11),
        item_id_count_Empl:DataTypes.INTEGER(11),
        total_item_all:DataTypes.INTEGER(11),
        item_id_count_all:DataTypes.INTEGER(11),
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'item_code_report', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return item_code_report;
};