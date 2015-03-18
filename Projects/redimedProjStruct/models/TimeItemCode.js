/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var TimeItemCode = sequelize.define('TimeItemCode',{
        ITEM_ID : {type:DataTypes.STRING(20), primaryKey: true} ,
        ITEM_NAME: DataTypes.TEXT,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE,
        deleted: DataTypes.INTEGER(11)
    },{
        tableName: 'time_item_code', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return TimeItemCode;
};