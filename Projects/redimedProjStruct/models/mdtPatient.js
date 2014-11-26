module.exports = function(sequelize, DataTypes){
    var mdtInstance = sequelize.define("mdtPatient", {
        'Patient_id': { 
            type: DataTypes.BIGINT(20),  
            primaryKey: true,
        },
        'Title': { 
            type: DataTypes.STRING(10),  
        },
        'First_name': { 
            type: DataTypes.STRING(50),  
        },
        'Sur_name': { 
            type: DataTypes.STRING(50),  
        },
        'Middle_name': { 
            type: DataTypes.STRING(20),  
        },
        'Known_as': { 
            type: DataTypes.STRING(50),  
        },
        'Address1': { 
            type: DataTypes.STRING(50),  
        },
        'Address2': { 
            type: DataTypes.STRING(50),  
        },
        'Surburb': { 
            type: DataTypes.STRING(50),  
        },
        'State': { 
            type: DataTypes.STRING(50),  
        },
        'Post_code': { 
            type: DataTypes.STRING(10),  
        },
        'Country': { 
            type: DataTypes.STRING(30),  
        },
        'DOB': { 
            type: DataTypes.DATE,  
        },
        'Sex': { 
            type: DataTypes.STRING(50),  
        },
        'Phone_ext': { 
            type: DataTypes.STRING(15),  
        },
        'Home_phone': { 
            type: DataTypes.STRING(15),  
        },
        'Work_phone': { 
            type: DataTypes.STRING(15),  
        },
        'Mobile': { 
            type: DataTypes.STRING(15),  
        },
        'No_SMS': { 
            type: DataTypes.INTEGER(11),  
        },
        'isLock': { 
            type: DataTypes.INTEGER(11),  
        },
        'Account_type': { 
            type: DataTypes.INTEGER(11),  
        },
        'Account_holder': { 
            type: DataTypes.STRING(100),  
        },
        'Account_Seft': { 
            type: DataTypes.INTEGER(11),  
        },
        'Medicare_no': { 
            type: DataTypes.INTEGER(11),  
        },
        'Ref': { 
            type: DataTypes.INTEGER(11),  
        },
        'Exp_medicare': { 
            type: DataTypes.DATE,  
        },
        'Private_fund_id': { 
            type: DataTypes.INTEGER(11),  
        },
        'MemberShip_no': { 
            type: DataTypes.INTEGER(11),  
        },
        'UPI': { 
            type: DataTypes.INTEGER(11),  
        },
        'HCC_Pension_No': { 
            type: DataTypes.INTEGER(11),  
        },
        'Exp_pension': { 
            type: DataTypes.DATE,  
        },
        'DVA_No': { 
            type: DataTypes.INTEGER(11),  
        },
        'Balance': { 
            type: DataTypes.INTEGER(11),  
        },
        'Pays_Gap_Only': { 
            type: DataTypes.INTEGER(11),  
        },
        'Partner_name': { 
            type: DataTypes.STRING(50),  
        },
        'Partner_DOB': { 
            type: DataTypes.DATE,  
        },
        'Partner_Occupation': { 
            type: DataTypes.STRING(50),  
        },
        'NOK_Emerg_Contact': { 
            type: DataTypes.STRING(50),  
        },
        'NOK_Phone': { 
            type: DataTypes.STRING(15),  
        },
        'Alias_First_name': { 
            type: DataTypes.STRING(50),  
        },
        'Alias_Sur_name': { 
            type: DataTypes.STRING(50),  
        },
        'Email': { 
            type: DataTypes.STRING(50),  
        },
        'GP_Sur_name': { 
            type: DataTypes.STRING(50),  
        },
        'GP_First_name': { 
            type: DataTypes.STRING(50),  
        },
        'Clinic': { 
            type: DataTypes.STRING(50),  
        },
        'Suburb': { 
            type: DataTypes.STRING(50),  
        },
        'Specialty': { 
            type: DataTypes.STRING(50),  
        },
        'Usual_provider': { 
            type: DataTypes.INTEGER(11),  
        },
        'Referral_source': { 
            type: DataTypes.INTEGER(11),  
        },
        'Marial_Status': { 
            type: DataTypes.STRING(50),  
        },
        'Diabetic': { 
            type: DataTypes.INTEGER(11),  
        },
        'Inactive': { 
            type: DataTypes.INTEGER(11),  
        },
        'Deceased': { 
            type: DataTypes.INTEGER(11),  
        },
        'Memo': { 
            type: DataTypes.STRING(100),  
        },
        'Occupation': { 
            type: DataTypes.STRING(50),  
        },
        'UR_no': { 
            type: DataTypes.INTEGER(11),  
        },
        'Custom': { 
            type: DataTypes.STRING(50),  
        },
        'Culture_id': { 
            type: DataTypes.INTEGER(11),  
        },
        'Language_id': { 
            type: DataTypes.INTEGER(11),  
        },
        'Student_id': { 
            type: DataTypes.INTEGER(11),  
        },
        'Faculty_id': { 
            type: DataTypes.INTEGER(11),  
        },
        'Fee_type': { 
            type: DataTypes.STRING(20),  
        },
        'Gradudate_status': { 
            type: DataTypes.INTEGER(11),  
        },
        'Patient_note': { 
            type: DataTypes.STRING(500),  
        },
        'Isenable': { 
            type: DataTypes.INTEGER(11),  
        },
        'Created_by': { 
            type: DataTypes.INTEGER(11),  
        },
        'Last_updated_by': { 
            type: DataTypes.INTEGER(11),  
        },
        'data': { 
            type: DataTypes.TEXT,  
        },
        'Type': { 
            type: DataTypes.STRING(15),  
        },
        'company_id': { 
            type: DataTypes.INTEGER(11),  
        }
    }, {
        tableName: "cln_patients",
        createdAt: "Creation_date",
        updatedAt: "Last_update_date"
    });
    
    return mdtInstance;
}