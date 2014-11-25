module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtBookingCandidates", {
            'Booking_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Candidate_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Candidates_name': { 
    type: DataTypes.STRING(50),  
            },
            'DoB': { 
    type: DataTypes.DATE,  
            },
            'Phone': { 
    type: DataTypes.STRING(20),  
            },
            'Email': { 
    type: DataTypes.STRING(50),  
            },
            'Position': { 
    type: DataTypes.STRING(50),  
            },
            'Appointment_time': { 
    type: DataTypes.DATE,  
            },
            'Appointment_notes': { 
    type: DataTypes.STRING(250),  
            },
            'Appointment_status': { 
    type: DataTypes.STRING(25),  
            },
            'RediMed_note': { 
    type: DataTypes.STRING(250),  
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
            'CALENDAR_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'resultFile': { 
    type: DataTypes.BLOB,  
            },
            'resultFileName': { 
    type: DataTypes.STRING(50),  
            },
            'resultFilePath': { 
    type: DataTypes.STRING(100),  
            },
            'isSendEmail': { 
    type: DataTypes.STRING(1),  
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
            'site_name': { 
    type: DataTypes.STRING(50),  
            },
            'state_name': { 
    type: DataTypes.STRING(50),  
            },
            'suburb_name': { 
    type: DataTypes.STRING(50),  
            },
            'state_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'suburb_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'CLN_CAL_ID': { 
    type: DataTypes.BIGINT(20),  
            },
            'CALENDAR_ID2': { 
    type: DataTypes.INTEGER(11),  
            },
            'CALENDAR_ID3': { 
    type: DataTypes.INTEGER(11),  
            },
            'CALENDAR_ID4': { 
    type: DataTypes.INTEGER(11),  
            },
            'CALENDAR_ID5': { 
    type: DataTypes.INTEGER(11),  
            },
            'header_candidate_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "booking_candidates",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}