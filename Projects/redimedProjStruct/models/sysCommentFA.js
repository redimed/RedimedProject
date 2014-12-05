module.exports = function(sequelize, DataTypes){
    var sysCommentFA = sequelize.define('sysCommentFA',{
        "FA_COMMENT_ID"  : {type:DataTypes.INTEGER(11), primaryKey:true},
        "LINE_ID" : DataTypes.INTEGER(11),
        "NAME": DataTypes.STRING(50),
        "VALUE" : DataTypes.STRING(20),
        "ISENABLE" : DataTypes.INTEGER(11),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date"  : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date"  : DataTypes.DATE,
        "Comment_Type" : DataTypes.INTEGER(11)
    },{
        tableName: 'sys_fa_df_comments', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return sysCommentFA;
};