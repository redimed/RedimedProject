/**
 * Created by thanh on 11/1/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var headersSASYS = sequelize.define('headersSASYS', {
        "SA_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_NAME": DataTypes.STRING(50),
        "ISENABLE": DataTypes.INTEGER(11),
        "SA_CODE": DataTypes.STRING(10),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "LAST_UPDATED_BY": DataTypes.INTEGER(11),
        "LAST_UPDATE DATE": DataTypes.DATE,
        "REPORT_TYPE": DataTypes.STRING(20),
        "RECIPIENT_NAME": DataTypes.STRING(200),
        "LOCATION_ID": DataTypes.INTEGER(11)
    }, {
        tableName: 'sys_sa_df_headers',
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATED_BY'
    });
    return headersSASYS;
}