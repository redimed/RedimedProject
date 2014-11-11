/**
 * Created by thanh on 10/29/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var linesMRSCLN = sequelize.define("linesMRSCLN", {
        "MRS_LINE_ID": {type: DataTypes.STRING(250), primaryKey: true},
        "MRS_GROUP_ID": DataTypes.STRING(250),
        "MRS_DF_ID": DataTypes.STRING(250),
        "PATIENT_ID": {type: DataTypes.STRING(250), primaryKey: true},
        "CAL_ID": {type: DataTypes.STRING(250), primaryKey: true},
        "ORD": DataTypes.STRING(250),
        "COMP_TYPE": DataTypes.STRING(250),
        "QUEST_LABEL": DataTypes.STRING(250),
        "QUEST_VALUE": DataTypes.STRING(10),
        "ISCOMMENT": DataTypes.STRING(250),
        "COMMENT_LABEL": DataTypes.STRING(500),
        "comments": DataTypes.STRING(20000),
        "ISREQ_COMMENT": DataTypes.STRING(250),
        "ISENABLE": DataTypes.STRING(250),
        "Created_by": DataTypes.STRING(250),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.STRING(250),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_mrs_lines',
        timestamps: false
    });
    return linesMRSCLN;
};