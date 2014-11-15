/**
 * Created by thanh on 10/24/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var subquestionsMHCLN = sequelize.define('subquestionsMHCLN', {
        "PATIENT_ID": DataTypes.INTEGER(11),
        "CAL_ID": DataTypes.INTEGER(11),

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
        tableName: 'cln_mh_df_line_subquestions',
        createdAt: 'CREATION_DATE',
        updatedAt: 'Last_update_date'
    });
    return subquestionsMHCLN;
};