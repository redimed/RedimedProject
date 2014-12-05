module.exports = function(sequelize, DataTypes){
    var sysLineMA = sequelize.define('sysLineMA',{
        "MA_LINE_ID" : {type:DataTypes.INTEGER(11), primaryKey:true},
        "MA_ID" : DataTypes.INTEGER(11),
        "QUESTION" : DataTypes.STRING(200),
        "VAL1_NAME" : DataTypes.STRING(50),
        "VAL1" : DataTypes.STRING(200),
        "VAL2_NAME" : DataTypes.STRING(50),
        "VAL2" : DataTypes.STRING(200),
        "VAL3_NAME" : DataTypes.STRING(50),
        "VAL3" : DataTypes.STRING(200),
        "VAL4_NAME" : DataTypes.STRING(50),
        "VAL4" : DataTypes.STRING(200),
        "VAL5_NAME" : DataTypes.STRING(50),
        "VAL5" : DataTypes.STRING(200),
        "VAL6_NAME" : DataTypes.STRING(50),
        "VAL6" : DataTypes.STRING(200),
        "YES_NO" : DataTypes.INTEGER(11),
        "COMMENTS" : DataTypes.STRING(200),
        "ORD" : DataTypes.INTEGER(11),
        "GROUP_ID" : DataTypes.INTEGER(11),
        "ISENABLE" : DataTypes.INTEGER(11),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date"  : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date" : DataTypes.DATE
    },{
        tableName: 'sys_ma_df_lines', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return sysLineMA;
};