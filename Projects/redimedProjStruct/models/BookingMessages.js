/**
 * Created by Phan Quoc Chien on 01/12/2014.
 */
//Model section
module.exports = function(sequelize, DataTypes){
    var BMessages = sequelize.define('BMessages',{
        "ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CONTENTS": DataTypes.STRING(500),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "LAST_UPDATED_BY": DataTypes.INTEGER(11),
        "LAST_UPDATED_DATE": DataTypes.DATE
    },{
        tableName: 'rl_messages', // đặt tên bảng
        timestamps: false
    });
    return BMessages;
};