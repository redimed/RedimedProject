
//Model comments
module.exports = function(sequelize, DataTypes){
    var CommentFA = sequelize.define('CommentFA',{
        "PATIENT_ID" : DataTypes.BIGINT(20),
        "CAL_ID" : DataTypes.INTEGER(11),
        "FA_COMMENT_ID" : DataTypes.INTEGER(11),
        "LINE_ID" : DataTypes.INTEGER(11),
        "NAME" : DataTypes.STRING(50),
        "VALUE" : DataTypes.STRING(20),
        "ISENABLE" : DataTypes.INTEGER(11),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date" : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date" : DataTypes.DATE,
        "Comment_Type" : DataTypes.INTEGER(11)
    },{
        tableName: 'cln_fa_df_comments', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return CommentFA;
};