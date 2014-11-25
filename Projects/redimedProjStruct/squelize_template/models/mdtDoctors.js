module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtDoctors", {
            'doctor_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'NAME': { 
    type: DataTypes.STRING(100),  
            },
            'Address': { 
    type: DataTypes.STRING(100),  
            },
            'Email': { 
    type: DataTypes.STRING(100),  
            },
            'User_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Provider_no': { 
    type: DataTypes.STRING(100),  
            },
            'Phone': { 
    type: DataTypes.STRING(15),  
            },
            'Signature': { 
    type: DataTypes.BLOB,  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
            'isReceiveEmailAfterHour': { 
    type: DataTypes.INTEGER(11),  
            },
            'Title': { 
    type: DataTypes.STRING(10),  
            },
            'First_name': { 
    type: DataTypes.STRING(30),  
            },
            'Middle_name': { 
    type: DataTypes.STRING(30),  
            },
            'Sur_name': { 
    type: DataTypes.STRING(50),  
            },
            'Qualification_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Prescriber_no': { 
    type: DataTypes.INTEGER(11),  
            },
            'Sign_off': { 
    type: DataTypes.STRING(50),  
            },
            'Payee_provider_no': { 
    type: DataTypes.INTEGER(11),  
            },
            'ABN_no': { 
    type: DataTypes.INTEGER(11),  
            },
            'Provider_type': { 
    type: DataTypes.INTEGER(11),  
            },
            'Specialty_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Default_bank_account_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Medical_Registration_no': { 
    type: DataTypes.INTEGER(11),  
            },
            'OSHC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAppointmentBook': { 
    type: DataTypes.INTEGER(11),  
            },
            'isMonday': { 
    type: DataTypes.INTEGER(11),  
            },
            'isTuesday': { 
    type: DataTypes.INTEGER(11),  
            },
            'isWednesday': { 
    type: DataTypes.INTEGER(11),  
            },
            'isThursday': { 
    type: DataTypes.INTEGER(11),  
            },
            'isFriday': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSaturday': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSunday': { 
    type: DataTypes.INTEGER(11),  
            },
            'Appt_interval': { 
    type: DataTypes.INTEGER(11),  
            },
            'Isenable': { 
    type: DataTypes.INTEGER(11),  
            },
            'CLINICAL_DEPT_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'isNewCalendarSlot': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "doctors",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}