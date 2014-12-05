module.exports = function(sequelize, DataTypes){
    var sysDetailFA = sequelize.define('sysDetailFA',{
        "DETAIL_ID"  : {type:DataTypes.INTEGER(11), primaryKey:true},
        "LINE_ID" : DataTypes.INTEGER(11),
        "QUESTION": DataTypes.STRING(200),
        "VAL1_NAME": DataTypes.STRING(50),
        "VAL1_ISVALUE" : DataTypes.INTEGER(11),
        "VAL1_VALUE": DataTypes.STRING(100),
        "VAL1_ISCHECKBOX" : DataTypes.INTEGER(11),
        "VAL1_CHECKBOX" : DataTypes.STRING(10),
        "VAL2_NAME": DataTypes.STRING(50),
        "VAL2_ISVALUE" : DataTypes.INTEGER(11),
        "VAL2_VALUE": DataTypes.STRING(100),
        "VAL2_ISCHECKBOX" : DataTypes.INTEGER(11),
        "VAL2_CHECKBOX" : DataTypes.STRING(10),
        "COMMENTS": DataTypes.STRING(200),
        "PICTURE" : DataTypes.TEXT,
        "ORD" : DataTypes.INTEGER(11),
        "ISENABLE" : DataTypes.INTEGER(11),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date"  : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date"  : DataTypes.DATE,
        "VAL1_ISCOMMENT_WHEN_YES" : DataTypes.INTEGER(11),
        "VAL1_ISCOMMENT_WHEN_NO" : DataTypes.INTEGER(11),
        "VAL2_ISCOMMENT_WHEN_YES" : DataTypes.INTEGER(11),
        "VAL2_ISCOMMENT_WHEN_NO" : DataTypes.INTEGER(11),
        "IsCommentText" : DataTypes.INTEGER(11),
        "LineTestRefer" : DataTypes.INTEGER(11),
        "VAL1_VALUE_IS_NUMBER" : DataTypes.INTEGER(11),
        "VAL2_VALUE_IS_NUMBER" : DataTypes.INTEGER(11)
    },{
        tableName: 'sys_fa_df_line_details', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return sysDetailFA;
};