
module.exports = function(sequelize, DataTypes){
    var LineMA = sequelize.define('LineMA',{
        "MA_LINE_ID"  : DataTypes.INTEGER(11),
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
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date" : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date" : DataTypes.DATE,
        "CAL_ID" : DataTypes.INTEGER(11),
        "PATIENT_ID" : DataTypes.INTEGER(11),
        "YES_NO_VAL" : DataTypes.INTEGER(11),
        "ISENABLE" : DataTypes.INTEGER(11)

    },{
        tableName: 'cln_ma_lines', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return LineMA;
};