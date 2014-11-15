/**
 * Created by thanh on 11/1/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var sectionsSASYS = sequelize.define('sectionsSASYS', {
        "SECTION_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_ID": DataTypes.INTEGER(11),
        "SECTION_NAME": DataTypes.STRING(50),
        "ORD": DataTypes.INTEGER(11),
        "USER_TYPE": DataTypes.STRING(10),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "LAST_UPDATED_BY": DataTypes.INTEGER(11),
        "LAST_UPDATE_DATE": DataTypes.DATE
    }, {
        tableName: 'sys_sa_df_sections',
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
    });
    return sectionsSASYS;
}