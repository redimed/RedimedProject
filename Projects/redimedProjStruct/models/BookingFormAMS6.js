module.exports = function(sequelize, DataTypes){
      var FormAms6 = sequelize.define('FormAms6', {
        "AMS6_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "BOOKING_ID": DataTypes.INTEGER(11),
        "WRK_NAME": DataTypes.STRING(100),
        "WRK_ADDRESS_1": DataTypes.STRING(100),
        "WRK_ADDRESS_2": DataTypes.STRING(100),
        "WRK_POSTCODE": DataTypes.STRING(100),
        "WRK_DATE_OF_BIRTH": DataTypes.DATE,
        "WRK_DATE_OF_INJURI": DataTypes.DATE,
        "WRK_INSURER_CLAIM_NUMBER": DataTypes.STRING(100),
        "WRK_DESCRIPTION_OF_INJURI": DataTypes.STRING(300),
        "WRK_PHONE": DataTypes.STRING(20),
        "WRK_EMAIL": DataTypes.STRING(50),
        "WRK_WORKCOVER_WA_CLAIM_NUMBER": DataTypes.STRING(100),
        "COMPANIES_ID": DataTypes.INTEGER(11) ,
        "EMP_ORGANISATION_NAME": DataTypes.STRING(100),
        "EMP_CONTACT_PERSON": DataTypes.STRING(100),
        "EMP_ADDRESS_1": DataTypes.STRING(100),
        "EMP_ADDRESS_2": DataTypes.STRING(100),
        "EMP_POSTCODE": DataTypes.STRING(100),
        "EMP_PHONE": DataTypes.STRING(15),
        "EMP_EMAIL": DataTypes.STRING(100),
        "EMP_NAME_OF_INSURER": DataTypes.STRING(100),
        "EMP_WORKCOVER_MUNBER": DataTypes.STRING(100),
        "PURPOSE_OF_THE_ASSESSMENT": DataTypes.INTEGER(11),
        "DATE_ASSESS": DataTypes.DATE,
        "INJURY_ASSESSMENT": DataTypes.STRING(500),
        "DOCTOR_ID": DataTypes.INTEGER(11),
        "DT_DATE": DataTypes.DATE,
        "DT_SIGNATURE": DataTypes.TEXT,
        "DT_NAME": DataTypes.STRING(100),
        "DT_ADDRESS_1": DataTypes.STRING(100),
        "DT_ADDRESS_2": DataTypes.STRING(100),
        "DT_POSTCODE": DataTypes.STRING(100),
        "DT_PHONE": DataTypes.STRING(15),
        "DT_EMAIL": DataTypes.STRING(100),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "LAST_UPDATED_BY": DataTypes.INTEGER(11),
        "LAST_UPDATED_DATE": DataTypes.DATE
    },{
        tableName: 'rl_form_ams6', // đặt tên bảng
        timestamps: false
    });
    return FormAms6;
};