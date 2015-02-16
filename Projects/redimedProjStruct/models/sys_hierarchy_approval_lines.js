module.exports = function(sequelize, DataTypes) {
    var sys_hierarchy_approval_lines = sequelize.define("sys_hierarchy_approval_lines", {
        "APPR_LINE_ID": DataTypes.INTEGER(11),
        "APPR_ORDER": DataTypes.INTEGER(11),
        "NODE_ID": DataTypes.INTEGER(11),
        "PREVIOUS_LINE_ID": DataTypes.INTEGER(11),
        "APPR_HEADER_ID": DataTypes.INTEGER(11),
        "APPR_USER_ID": DataTypes.INTEGER(11),
        "ORG_AMOUNT": DataTypes.FLOAT,
        "ORG_QUANTITY": DataTypes.FLOAT,
        "PRICE": DataTypes.FLOAT,
        "APPR_QUANTITY": DataTypes.FLOAT,
        "APPR_AMOUNT": DataTypes.FLOAT,
        "STATUS": DataTypes.STRING(20),
        "COMMENTS": DataTypes.STRING(500),
        "SOURCE_NAME": DataTypes.STRING(50),
        "SOURCE_HEADER_ID": DataTypes.INTEGER(11),
        "SOURCE_LINE_ID": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "RELEASE_QUANTITY": DataTypes.FLOAT,
        "tempReleasingQuantity": DataTypes.FLOAT,
        "tempPrimaryReleasingQuantity": DataTypes.FLOAT,
        "tempReleasingPrice": DataTypes.FLOAT,
        "tempIsRelease": DataTypes.INTEGER(11),
        "isSendEmailAppr": DataTypes.INTEGER(11)
    }, {
        tableName: "sys_hierarchy_approval_lines",
        createdAt: "CREATION_DATE",
        updatedAt: "Last_update_date"
    });
    return sys_hierarchy_approval_lines;
};
