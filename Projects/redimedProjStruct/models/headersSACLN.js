/**
 * Created by thanh on 11/1/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var headersSACLN = sequelize.define('headersSACLN', {
        "patient_id": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_NAME": DataTypes.STRING(50),
        "ISENABLE": DataTypes.INTEGER(11),
        "SA_CODE": DataTypes.STRING(10),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "test_date": DataTypes.DATE,
        "tester": DataTypes.STRING(50),
        "report_type": DataTypes.STRING(20),
        "RECIPIENT_NAME": DataTypes.STRING(200),
        "DOCTOR_ID": DataTypes.INTEGER(11),
        "Signature": DataTypes.TEXT,
        "LOCATION_ID": DataTypes.INTEGER(11)
    }, {
        tableName: 'cln_sa_df_headers',
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });
    return headersSACLN;
};