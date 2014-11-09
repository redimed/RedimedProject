/**
 * Created by thanh on 10/29/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var linesMRSSYS = sequelize.define("linesMRSSYS", {
        "MRS_LINE_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MRS_GROUP_ID": DataTypes.INTEGER(11),
        "MRS_DF_ID": DataTypes.INTEGER(11),
        "ORD": DataTypes.INTEGER(11),
        "COMP_TYPE": DataTypes.INTEGER(11),
        "QUEST_LABEL": DataTypes.STRING(250),
        "ISCOMMENT": DataTypes.INTEGER(11),
        "COMMENT_LABEL": DataTypes.STRING(500),
        "ISREQ_COMMENT": DataTypes.INTEGER(11),
        "ISENABLE": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'sys_mrs_lines',
        timestamps: false
    });
    return linesMRSSYS;
};