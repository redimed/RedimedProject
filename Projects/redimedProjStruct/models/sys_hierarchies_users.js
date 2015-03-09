module.exports = function(sequelize, DataTypes) {
    var sys_hierarchies_users = sequelize.define("sys_hierarchies_users", {
        "NODE_ID": DataTypes.INTEGER(11),
        "USER_ID": DataTypes.INTEGER(11),
        "DEPARTMENT_CODE_ID": DataTypes.INTEGER(11),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: "sys_hierarchies_users",
        createdAt: "CREATION_DATE",
        updatedAt: "Last_update_date"
    });
    return sys_hierarchies_users;
};
