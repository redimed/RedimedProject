/**
 * Created by thanh on 10/10/2014.
 */
/**
 * begin table cln_md_df_headers
 */
module.exports = function (sequelize, DataTypes) {
    var Headers = sequelize.define('Sections', {
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MH_LINE_SUB_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MH_LINE_ID": DataTypes.INTEGER(11),
        "ORD": DataTypes.INTEGER(11),
        "QUESTION": DataTypes.STRING(200),
        "YES_NO": DataTypes.INTEGER(11),
        "ISCOMMENT_WHEN_YES": DataTypes.INTEGER(11),
        "ISCOMMENT_WHEN_NO": DataTypes.INTEGER(11),
        "Comments": DataTypes.STRING(200),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_mh_df_headers',
        timestamps: false
    });
    return Headers;
}
/**
 * end table cln_mh_df_headers
 */

/**
 * begin table cln_mh_df_groups
 * @param sequelize
 * @param DataTypes
 */
module.exports = function (sequelize, DataTypes) {
    var Groups = sequelize.define('Groups', {
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
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
        tableName: 'cln_mh_df_Groups',
        timestamps: false
    });
    return Groups;
};
/**
 * end table cln_mh-df_groups
 */

/**
 * begin table cln_mh_df_lines
 */
module.exports = function (sequelize, DataTypes) {
    var Lines = sequelize.define('Lines', {
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MH_LINE_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "GROUP_ID": DataTypes.INTEGER(11),
        "MH_DF_ID": DataTypes.INTEGER(11),
        "ORD": DataTypes.INTEGER(11),
        "QUESTION": DataTypes.STRING(200),
        "YES_NO": DataTypes.INTEGER(11),
        "ISCOMMENT_WHEN_YES": DataTypes.INTEGER(11),
        "ISCOMMENT_WHEN_NO": DataTypes.INTEGER(11),
        "Comments": DataTypes.STRING(200),
        "ISDETAILS_ANSWER_ONLY": DataTypes.INTEGER(11),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "ISDetails_Answer_IfYes": DataTypes.INTEGER(11)
    }, {
        tableName: 'cln_mh_df_lines',
        timestamps: false
    });
    return Lines;
};
/**
 * end table lines
 */

/**
 * begin table subquestion
 */
module.exports = function (sequelize, DataTypes) {
    var Subquestions;
    Subquestions = sequelize.define('Subquestions', {
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MH_LINE_SUB_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MH_LINE_ID": DataTypes.INTEGER(11),
        "ORD": DataTypes.INTEGER(11),
        "QUESTION": DataTypes.STRING(200),
        "YES_NO": DataTypes.INTEGER(11),
        "ISCOMMENT_WHEN_YES": DataTypes.INTEGER(11),
        "ISCOMMENT_WHEN_NO": DataTypes.INTEGER(11),
        "Comments": DataTypes.STRING(200),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_mh_df_subquestions',
        timestamps: false
    });
    return Subquestions;
};