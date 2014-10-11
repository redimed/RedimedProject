/**
 * Created by thanh on 10/10/2014.
 */

/**
 * begin table cln_mrs_headers
 */
module.exports = function (sequelize, DataTypes) {
    var Headers = sequelize.define("Headers", {
        "MRS_GROUP_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MRS_DF_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": DataTypes.INTEGER(11),
        "ORD": DataTypes.INTEGER(11),
        "GROUP_NAME": DataTypes.STRING(200),
        "USER_TYPE": DataTypes.STRING(10),
        "ISENABLE": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_mrs_headers',
        timestamps: false
    });
    return Headers;
};
/**
 * end table cln_mrs_headers
 */

/**
 * begin table cln_mrs_groups
 */
module.exports = function (sequelize, DataTypes) {
    var Groups = sequelize.define("Groups", {
        "MRS_GROUP_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MRS_DF_ID": DataTypes.INTEGER(11),
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "ORD": DataTypes.INTEGER(11),
        "GROUP_NAME": DataTypes.STRING(200),
        "USER_TYPE": DataTypes.STRING(10),
        "ISENABLE": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_mrs_Groups',
        timestamps: false
    });
    return Groups;
};

/**
 * end table cln_mrs_groups
 */

/**
 * begin table cln_mrs_lines
 */
module.exports = function (sequelize, DataTypes) {
    var Lines = sequelize.define('Lines', {
        "MRS_LINE_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MRS_GROUP_ID": DataTypes.INTEGER(11),
        "MRS_DF_ID": DataTypes.INTEGER(11),
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "ORD": DataTypes.INTEGER(11),
        "COMP_TYPE": DataTypes.INTEGER(11),
        "QUEST_LABEL": DataTypes.STRING(200),
        "QUEST_VALUE": DataTypes.STRING(10),
        "ISCOMMENT": DataTypes.INTEGER(11),
        "COMMENT_LABEL": DataTypes.STRING(500),
        "comments": DataTypes.STRING(20000),
        "ISREQ_COMMENT": DataTypes.INTEGER(11),
        "ISENABLE": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_mrs_lines',
        timestamps: false
    });
    return Lines;
};
/**
 * begin table cln_mrs_lines
 */

