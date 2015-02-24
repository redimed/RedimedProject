module.exports = function(sequelize, DataTypes) {
    var sys_hierarchy_approval_headers = sequelize.define("sys_hierarchy_approval_headers", {
        "APPR_HEADER_ID": DataTypes.INTEGER(11),
        "GROUP_ID": DataTypes.INTEGER(11),
        "SOURCE_NAME": DataTypes.STRING(50),
        "SOURCE_HEADER_ID": DataTypes.INTEGER(11),
        "SOURCE_LINE_ID": DataTypes.INTEGER(11),
        "FROM_USER_ID": DataTypes.INTEGER(11),
        "HEADER_AMOUNT": DataTypes.FLOAT,
        "LINE_AMOUNT": DataTypes.FLOAT,
        "LINE_QUANTITY": DataTypes.FLOAT,
        "LINE_PRICE": DataTypes.FLOAT,
        "STATUS": DataTypes.STRING(20),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: "sys_hierarchy_approval_headers",
        createdAt: "CREATION_DATE",
        updatedAt: 'Last_update_date'
    });
    return sys_hierarchy_approval_headers;
};
