
module.exports = function(sequelize, DataTypes){
    var GroupMA = sequelize.define('GroupMA',{
        "GROUP_ID" : DataTypes.INTEGER(11),
        "GROUP_NAME" : DataTypes.STRING(50),
        "MA_ID" : DataTypes.INTEGER(11),
        "USER_TYPE" : DataTypes.STRING(10),
        "CAL_ID": DataTypes.INTEGER(11),
        "PATIENT_ID": DataTypes.INTEGER(11),
        "ISENABLE" : DataTypes.INTEGER(11),
        "Description" : DataTypes.STRING(2000)

    },{
        tableName: 'cln_ma_group'// đặt tên bảng
    });
    return GroupMA;
};

