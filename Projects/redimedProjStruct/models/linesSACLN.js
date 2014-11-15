/**
 * Created by thanh on 11/1/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var linesSACLN = sequelize.define('linesSACLN', {
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "LINE_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SECTION_ID": DataTypes.INTEGER(11),
        "SA_ID": DataTypes.INTEGER(11),
        "NAME": DataTypes.INTEGER(11),
        "VALUE_RIGHT": DataTypes.INTEGER(11),
        "VALUE_LEFT": DataTypes.INTEGER(11),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "LAST_UPDATED_BY": DataTypes.INTEGER(11),
        "LAST_UPDATE_DATE": DataTypes.DATE
    }, {
        tableName: 'cln_sa_df_lines',
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
    });
    return linesSACLN;
}