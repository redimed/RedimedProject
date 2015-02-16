module.exports = function(sequelize, DataTypes) {
    var sys_hierarchy_nodes = sequelize.define("sys_hierarchy_nodes", {
        "NODE_ID": {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        "NODE_CODE": DataTypes.STRING(20),
        "FROM_VALUE": DataTypes.FLOAT,
        "TO_VALUE": DataTypes.FLOAT,
        "ISVALUE": DataTypes.INTEGER(11),
        "TO_NODE_ID": DataTypes.INTEGER(11),
        "GROUP_ID": DataTypes.INTEGER(11),
        "DECRIPTION": DataTypes.STRING(100),
        "GROUP_TYPE": DataTypes.STRING(20),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "seq": DataTypes.INTEGER(11),
    }, {
        tableName: "sys_hierarchy_nodes",
        createdAt: "CREATION_DATE",
        updatedAt: "Last_update_date"
    });
    return sys_hierarchy_nodes;
};
