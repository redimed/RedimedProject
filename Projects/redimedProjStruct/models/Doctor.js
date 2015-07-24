/**
 * Created by thanh on 11/22/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var Doctor = sequelize.define("Doctor", {
        "doctor_id": {
            type: DataTypes.INTEGER(11), 
            primaryKey: true,
            autoIncrement: true
        },
        "NAME": DataTypes.STRING(100),
        "Address": DataTypes.STRING(100),
        "Email": DataTypes.STRING(100),
        "User_id": DataTypes.INTEGER(11),
        "Provider_no": DataTypes.STRING(100),
        "Phone": DataTypes.STRING(15),
        "Signature": DataTypes.TEXT,
        "Created_by": DataTypes.INTEGER(11),
        "Last_updated_by": DataTypes.INTEGER(11),
        "isReceiveEmailAfterHour": DataTypes.INTEGER(11),
        "Title": DataTypes.STRING(10),
        "First_name": DataTypes.STRING(30),
        "Middle_name": DataTypes.STRING(30),
        "Sur_name": DataTypes.STRING(50),
        "Qualification_id": DataTypes.INTEGER(11),
        "Prescriber_no": DataTypes.INTEGER(11),
        "Sign_off": DataTypes.STRING(50),
        "Payee_provider_no": DataTypes.INTEGER(11),
        "ABN_no": DataTypes.INTEGER(11),
        "Provider_type": DataTypes.INTEGER(11),
        "Specialty_id": DataTypes.INTEGER(11),
        "Default_bank_account_id": DataTypes.INTEGER(11),
        "Medical_Registration_no": DataTypes.INTEGER(11),
        "OSHC_ID": DataTypes.INTEGER(11),
        "isAppointmentBook": DataTypes.INTEGER(11),
        "isMonday": DataTypes.INTEGER(11),
        "isTuesday": DataTypes.INTEGER(11),
        "isWednesday": DataTypes.INTEGER(11),
        "isThursday": DataTypes.INTEGER(11),
        "isFriday": DataTypes.INTEGER(11),
        "isSaturday": DataTypes.INTEGER(11),
        "isSunday": DataTypes.INTEGER(11),
        "Appt_interval": DataTypes.INTEGER(11),
        "Isenable": DataTypes.INTEGER(11),
        "CLINICAL_DEPT_ID": DataTypes.INTEGER(11),
        "isNewCalendarSlot": DataTypes.INTEGER(11),
        "isOnline": DataTypes.INTEGER(11),
        "currentSite": DataTypes.INTEGER(11),
        "numsOfRoom": DataTypes.INTEGER(11),
        assist_user: DataTypes.INTEGER(11)
    }, {
        tableName: 'doctors',
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date',
        classMethods: {
            associate: function(models) {
                Doctor.belongsTo(models.Department, { 
                    as: 'Department',
                    foreignKey: 'CLINICAL_DEPT_ID'
                });
    

            }
        }
    });
    return Doctor;
};