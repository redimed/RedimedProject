module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnAppointmentCalendar", {
            'CAL_ID': { 
    type: DataTypes.BIGINT(20),  
            primaryKey: true,
                    },
            'DOCTOR_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FROM_TIME': { 
    type: DataTypes.DATE,  
            },
            'TO_TIME': { 
    type: DataTypes.DATE,  
            },
            'NOTES': { 
    type: DataTypes.STRING(50),  
            },
            'PHONE': { 
    type: DataTypes.STRING(20),  
            },
            'APP_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'STATUS': { 
    type: DataTypes.STRING(20),  
            },
            'ARR_TIME': { 
    type: DataTypes.DATE,  
            },
            'ATTEND_TIME': { 
    type: DataTypes.DATE,  
            },
            'AVAILABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'Patient_id': { 
    type: DataTypes.BIGINT(20),  
            },
            'SERVICE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CLINICAL_DEPT_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACC_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'bill_to': { 
    type: DataTypes.INTEGER(11),  
            },
            'PATIENTS': { 
    type: DataTypes.TEXT,  
            },
}, {
tableName: "cln_appointment_calendar",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}