/**
 * Created by thanh on 11/1/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var headersSASYS = sequelize.define('headersSASYS', {
        "SA_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_NAME": DataTypes.STRING(50),
        "ISENABLE": DataTypes.INTEGER(11),
        "SA_CODE": DataTypes.STRING(10),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "report_type": DataTypes.STRING(20),
        "RECIPIENT_NAME": DataTypes.STRING(200),
        "LOCATION_ID": DataTypes.INTEGER(11)
    }, {
        tableName: 'sys_sa_df_headers',
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });
    return headersSASYS;
}