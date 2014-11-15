/**
 * Created by thanh on 10/24/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var groupsMHSYS = sequelize.define('groupsMHSYS', {

        "GROUP_ID": {type: DataTypes.INTEGER(11), primaryKey: true},

        "MH_DF_ID": DataTypes.INTEGER(11),
        "ORD": DataTypes.INTEGER(11),
        "GROUP_NAME": DataTypes.STRING(200),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "USER_TYPE": DataTypes.STRING(10)
    }, {
        tableName: 'sys_mh_df_groups',
        createdAt: 'CREATION_DATE',
        updatedAt: 'Last_update_date'
    });
    return groupsMHSYS;
};
