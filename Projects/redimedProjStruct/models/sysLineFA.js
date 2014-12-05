module.exports = function(sequelize, DataTypes){
    var sysLineFA = sequelize.define('sysLineFA',{
        "LINE_ID"  : {type:DataTypes.INTEGER(11), primaryKey:true},
        "SECTION_ID" : DataTypes.INTEGER(11),
        "FA_ID" : DataTypes.INTEGER(11),
        "QUESTION": DataTypes.STRING(200),
        "PICTURE" : DataTypes.TEXT,
        "ISSCORE1" : DataTypes.INTEGER(11),
        "SCORE_TYPE1" : DataTypes.INTEGER(11),
        "SCORE1" : DataTypes.INTEGER(11),
        "ISRATING1" : DataTypes.INTEGER(11),
        "RATING_ID1" : DataTypes.INTEGER(11),
        "RATING_VALUE1" : DataTypes.INTEGER(11),
        "COMMENTS": DataTypes.STRING(200),
        "ORD" : DataTypes.INTEGER(11),
        "ISSCORE2" : DataTypes.INTEGER(11),
        "SCORE_TYPE2" : DataTypes.INTEGER(11),
        "SCORE2" : DataTypes.INTEGER(11),
        "ISRATING2" : DataTypes.INTEGER(11),
        "RATING_ID2" : DataTypes.INTEGER(11),
        "RATING_VALUE2" : DataTypes.INTEGER(11),
        "ISENABLE" : DataTypes.INTEGER(11),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date"  : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date"  : DataTypes.DATE,
        "IsCommentsText" : DataTypes.INTEGER(11),
        "LineType" : DataTypes.INTEGER(11),
        "RATE1" : DataTypes.STRING(20),
        "RATE2" : DataTypes.STRING(20),
        "VAL1_NAME_HEADER": DataTypes.STRING(50),
        "VAL1_VALUE_HEADER": DataTypes.STRING(50),
        "VAL2_NAME_HEADER": DataTypes.STRING(50),
        "VAL2_VALUE_HEADER": DataTypes.STRING(50),
        "IS_SHOW_RANKING_TABLE" : DataTypes.INTEGER(11)
    },{
        tableName: 'sys_fa_df_lines', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return sysLineFA;
};