/**
 * Created by thanh on 11/24/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var APPTCAL = sequelize.define('APPTCAL', {
        "CAL_ID": DataTypes.INTEGER(20),
        "DOCTOR_ID": DataTypes.INTEGER(11),
        "SITE_ID": DataTypes.INTEGER(11),
        "FROM_TIME": DataTypes.DATE,
        "TO_TIME": DataTypes.DATE,
        "NOTES": DataTypes.STRING(50),
        "PHONE": DataTypes.STRING(20),
        "APP_TYPE": DataTypes.STRING(10),
        "STATUS": DataTypes.STRING(20),
        "ARR_TIME": DataTypes.DATE,
        "ATTEND_TIME": DataTypes.DATE,
        "AVAILABLE": DataTypes.INTEGER(11),
        "Patient_id": DataTypes.INTEGER(20),
        "SERVICE_ID": DataTypes.INTEGER(11),
        "CLINICAL_DEPT_ID": DataTypes.INTEGER(11),
        "ACC_TYPE": DataTypes.STRING(10),
        "bill_to": DataTypes.INTEGER(11)
    }, {
        tableName: 'cln_appointment_calendar',
        timestamps: false
    });

    return APPTCAL;
};