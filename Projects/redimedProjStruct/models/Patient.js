module.exports = function(sequelize, DataTypes){
    var Patient = sequelize.define('Patient',{
        "Patient_id" : {
            type:DataTypes.BIGINT(20), 
            primaryKey:true,
            autoIncrement: true
        },
        "Title": DataTypes.STRING(10),
        "First_name": DataTypes.STRING(50),
        "Sur_name": DataTypes.STRING(50),
        "Middle_name" : DataTypes.STRING(20),
        "Known_as": DataTypes.STRING(50),
        "Address1": DataTypes.STRING(50),
        "Address2": DataTypes.STRING(50),
        "Surburb": DataTypes.STRING(50),
        "State": DataTypes.STRING(50),
        "Post_code": DataTypes.STRING(10),
        "Country" : DataTypes.STRING(30),
        "DOB" : DataTypes.DATE,
        "Sex": DataTypes.STRING(50),
        "Phone_ext" : DataTypes.STRING(15),
        "Home_phone" : DataTypes.STRING(15),
        "Work_phone" : DataTypes.STRING(15),
        "Mobile" : DataTypes.STRING(15),
        "No_SMS" : DataTypes.INTEGER(11),
        "isLock" : DataTypes.INTEGER(11),
        "Account_type" : DataTypes.INTEGER(11),
        "Account_holder" : DataTypes.STRING(100),
        "Account_Seft" : DataTypes.INTEGER(11),
        "Medicare_no" : DataTypes.INTEGER(11),
        "Ref" : DataTypes.INTEGER(11),
        "Exp_medicare" : DataTypes.DATE,
        "Private_fund_id" : DataTypes.INTEGER(11),
        "MemberShip_no" : DataTypes.INTEGER(11),
        "UPI" : DataTypes.INTEGER(11),
        "HCC_Pension_No" : DataTypes.INTEGER(11),
        "Exp_pension" : DataTypes.DATE,
        "DVA_No" : DataTypes.INTEGER(11),
        "Balance" : DataTypes.INTEGER(11),
        "Pays_Gap_Only" : DataTypes.INTEGER(11),
        "Partner_name": DataTypes.STRING(50),
        "Partner_DOB" : DataTypes.DATE,
        "Partner_Occupation": DataTypes.STRING(50),
        "NOK_Emerg_Contact": DataTypes.STRING(50),
        "NOK_Phone" : DataTypes.STRING(15),
        "Alias_First_name": DataTypes.STRING(50),
        "Alias_Sur_name": DataTypes.STRING(50),
        "Email": DataTypes.STRING(50),
        "GP_Sur_name": DataTypes.STRING(50),
        "GP_First_name": DataTypes.STRING(50),
        "Clinic": DataTypes.STRING(50),
        "Suburb": DataTypes.STRING(50),
        "Specialty": DataTypes.STRING(50),
        "Usual_provider" : DataTypes.INTEGER(11),
        "Referral_source" : DataTypes.INTEGER(11),
        "Marial_Status": DataTypes.STRING(50),
        "Diabetic" : DataTypes.INTEGER(11),
        "Inactive" : DataTypes.INTEGER(11),
        "Deceased" : DataTypes.INTEGER(11),
        "Memo" : DataTypes.STRING(100),
        "Occupation": DataTypes.STRING(50),
        "UR_no" : DataTypes.INTEGER(11),
        "Custom": DataTypes.STRING(50),
        "Culture_id" : DataTypes.INTEGER(11),
        "Language_id" : DataTypes.INTEGER(11),
        "Student_id" : DataTypes.INTEGER(11),
        "Faculty_id" : DataTypes.INTEGER(11),
        "Fee_type" : DataTypes.STRING(20),
        "Gradudate_status" : DataTypes.INTEGER(11),
        "Patient_note": DataTypes.STRING(500),
        "Isenable" : DataTypes.INTEGER(11),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "company_id": DataTypes.INTEGER(11),
        "avatar": DataTypes.STRING(200)
    },{
        tableName: 'cln_patients', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date',
        classMethods: {
            associate: function(models) {
                Patient.belongsTo(models.Company, { as: 'Company', foreignKey: 'company_id'});
                Patient.hasMany(models.Company, {  as: 'Companies', foreignKey: 'patient_id', through: 'patient_companies' });

                // Patient.hasMany(models.Claim, { foreignKey: 'Patient_id', as: 'Claims' });
                // Patient.hasMany(models.OutsideReferral, { foreignKey: 'patient_id', as: 'OutsideReferrals' });
                
                Patient.hasMany(models.Appointment,{
                    as: 'Appointments', 
                    foreignKey: 'Patient_id',
                    // through: 'cln_appt_patients'
                    through: models.ApptPatient
                });

            },
            getUploadPath: function(){
                return 'uploadFile/PatientPicture/';
            }
        }
    });
    return Patient;
};
