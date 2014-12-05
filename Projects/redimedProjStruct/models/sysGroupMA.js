module.exports = function(sequelize, DataTypes){
    var sysGroupMA = sequelize.define('sysGroupMA',{
        "GROUP_ID" : {type:DataTypes.INTEGER(11), primaryKey:true},
        "GROUP_NAME" : DataTypes.STRING(50),
        "QUEST_DF_ID" : DataTypes.INTEGER(11),
        "USER_TYPE" : DataTypes.STRING(10),
        "ISENABLE" : DataTypes.INTEGER(11),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date" : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date" : DataTypes.DATE,
        "Description" : DataTypes.STRING(2000)
    },{
        tableName: 'sys_ma_df_group', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return sysGroupMA;
};