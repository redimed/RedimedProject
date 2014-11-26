module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtRlBooking", {
            'BOOKING_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'BOOKING_DATE': { 
    type: DataTypes.DATE,  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'RL_TYPE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SPECIALITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'DOCTOR_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FROM_DATE': { 
    type: DataTypes.DATE,  
            },
            'TO_DATE': { 
    type: DataTypes.DATE,  
            },
            'CAL_ID': { 
    type: DataTypes.BIGINT(20),  
            },
            'ASS_SURNAME': { 
    type: DataTypes.STRING(50),  
            },
            'ASS_OTHERNAMES': { 
    type: DataTypes.STRING(50),  
            },
            'ASS_CONTACT_NO': { 
    type: DataTypes.STRING(20),  
            },
            'ASS_EMAIL': { 
    type: DataTypes.STRING(50),  
            },
            'WRK_SURNAME': { 
    type: DataTypes.STRING(50),  
            },
            'WRK_OTHERNAMES': { 
    type: DataTypes.STRING(50),  
            },
            'WRK_CONTACT_NO': { 
    type: DataTypes.STRING(20),  
            },
            'WRK_EMAIL': { 
    type: DataTypes.STRING(50),  
            },
            'DESC_INJURY': { 
    type: DataTypes.STRING(200),  
            },
            'ISNEW': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISCONTACTPATIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISCONTACTMANAGER': { 
    type: DataTypes.INTEGER(11),  
            },
            'NOTES': { 
    type: DataTypes.STRING(200),  
            },
            'STATUS': { 
    type: DataTypes.STRING(20),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'refered_date_string': { 
    type: DataTypes.STRING(100),  
            },
            'isUrgent': { 
    type: DataTypes.INTEGER(11),  
            },
            'CLAIM_NO': { 
    type: DataTypes.STRING(20),  
            },
            'WRK_DOB': { 
    type: DataTypes.DATE,  
            },
            'APPOINTMENT_DATE': { 
    type: DataTypes.DATE,  
            },
            'ASS_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EMPLOYEE_NUMBER': { 
    type: DataTypes.STRING(20),  
            },
            'DEPARTMENT_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'DESC_VACCIN': { 
    type: DataTypes.STRING(200),  
            },
            'BOOKING_TYPE': { 
    type: DataTypes.STRING(20),  
            },
}, {
tableName: "rl_bookings",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}