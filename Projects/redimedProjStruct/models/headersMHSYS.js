/**
 * Created by thanh on 10/24/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var headersMHSYS = sequelize.define('headersMHSYS', {
        "MH_DF_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "DF_CODE": DataTypes.STRING(10),
        "DESCRIPTION": DataTypes.STRING(100),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'sys_mh_df_headers',
        timestamps: false
    });
    return headersMHSYS;
};