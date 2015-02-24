module.exports = function(sequelize, DataTypes) {
    var sys_hierarchy_group = sequelize.define("sys_hierarchy_group", {
        "GROUP_ID": {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        "GROUP_NAME": DataTypes.STRING(50),
        "DECRIPTION": DataTypes.STRING(100),
        "GROUP_TYPE": DataTypes.STRING(20),
        "COMPANY_ID": DataTypes.INTEGER(11),
        "SITE_ID": DataTypes.INTEGER(11),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: "sys_hierarchy_group",
        createdAt: "CREATION_DATE",
        updatedAt: "Last_update_date"
    });
    return sys_hierarchy_group;
}
