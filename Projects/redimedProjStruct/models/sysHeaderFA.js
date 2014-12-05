module.exports = function(sequelize, DataTypes){
    var sysHeaderFA = sequelize.define('sysHeaderFA',{
        "FA_ID"  : {type:DataTypes.INTEGER(11), primaryKey:true},
        "ENTITY_ID" : DataTypes.INTEGER(11),
        "TYPE" : DataTypes.STRING(10),
        "FA_NAME": DataTypes.STRING(50),
        "ISENABLE" : DataTypes.INTEGER(11),
        "ITEM_ID" : DataTypes.INTEGER(11),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date"  : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date"  : DataTypes.DATE,
        "Risk" : DataTypes.STRING(10),
        "Comments": DataTypes.STRING(200),
        "Recommend" : DataTypes.STRING(10),
        "Att_Flexibility" : DataTypes.INTEGER(11),
        "Att_Core_Stability" : DataTypes.INTEGER(11),
        "Att_Wirst_Elbow_func" : DataTypes.INTEGER(11),
        "Att_Shoulder_func" : DataTypes.INTEGER(11),
        "Att_Lower_Limb_func" : DataTypes.INTEGER(11),
        "Att_Balance" : DataTypes.INTEGER(11),
        "ASSESSED_ID" : DataTypes.INTEGER(11),
        "ASSESSED_SIGN"  : DataTypes.BLOB,
        "ASSESSED_DATE"  : DataTypes.DATE,
        "ASSESSED_NAME": DataTypes.STRING(100)
    },{
        tableName: 'sys_fa_df_headers', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return sysHeaderFA;
};