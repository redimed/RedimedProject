module.exports = function(sequelize, DataTypes){
    var sysHeaderMA = sequelize.define('sysHeaderMA',{
        "QUEST_DF_ID": {type:DataTypes.INTEGER(11), primaryKey:true},
        "DESCRIPTION" : DataTypes.STRING(200),
        "DF_CODE" : DataTypes.STRING(10),
        "ITEM_ID" : DataTypes.STRING(10),
        "ISENABLE" : DataTypes.INTEGER(11),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date"  : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date" : DataTypes.DATE
    },{
        tableName: 'sys_ma_df_headers', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return sysHeaderMA;
};
