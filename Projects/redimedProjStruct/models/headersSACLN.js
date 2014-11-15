/**
 * Created by thanh on 11/1/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var headersSACLN = sequelize.define('headersSACLN', {
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_NAME": DataTypes.STRING(50),
        "ISENABLE": DataTypes.INTEGER(11),
        "SA_CODE": DataTypes.STRING(10),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "LAST_UPDATED_BY": DataTypes.INTEGER(11),
        "LAST_UPDATE_DATE": DataTypes.DATE,
        "TEST_DATE": DataTypes.DATE,
        "TESTER": DataTypes.STRING(50),
        "REPORT_TYPE": DataTypes.STRING(20),
        "RECIPIENT_NAME": DataTypes.STRING(200),
        "DOCTOR_ID": DataTypes.INTEGER(11),
        "SIGNATURE": DataTypes.BLOB,
        "LOCATION_ID": DataTypes.INTEGER(11)
    }, {
        tableName: 'cln_sa_df_headers',
        createdAt: 'CREATION_DATE',
        updatedAt: 'LAST_UPDATE_DATE'
    });
    return headersSACLN;
};