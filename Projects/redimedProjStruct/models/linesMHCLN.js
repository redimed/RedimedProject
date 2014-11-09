/**
 * Created by thanh on 10/24/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var linesMHCLN = sequelize.define('linesMHCLN', {
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
    return linesMHCLN;
};