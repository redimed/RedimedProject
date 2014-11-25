module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtThRedimedReferrals", {
            'ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'TELEHEALTH_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CT_SCAN': { 
    type: DataTypes.INTEGER(11),  
            },
            'X_RAY': { 
    type: DataTypes.INTEGER(11),  
            },
            'MRI': { 
    type: DataTypes.INTEGER(11),  
            },
            'ULTRASOUND': { 
    type: DataTypes.INTEGER(11),  
            },
            'PATHOLOGY': { 
    type: DataTypes.INTEGER(11),  
            },
            'CLINICAL_DETAILS': { 
    type: DataTypes.STRING(600),  
            },
            'ALLERGIES': { 
    type: DataTypes.INTEGER(11),  
            },
            'REQUESTING_PRACTITIONER': { 
    type: DataTypes.STRING(300),  
            },
            'REPORT_URGENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'ELECTRONIC': { 
    type: DataTypes.INTEGER(11),  
            },
            'FAX': { 
    type: DataTypes.INTEGER(11),  
            },
            'MAIL': { 
    type: DataTypes.INTEGER(11),  
            },
            'PHONE': { 
    type: DataTypes.INTEGER(11),  
            },
            'RETURN_WITH_PATIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'APPOINTMENT_DATE': { 
    type: DataTypes.DATE,  
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
            'AssessmentName': { 
    type: DataTypes.STRING(100),  
            },
            'AssessmentId': { 
    type: DataTypes.STRING(50),  
            },
}, {
tableName: "th_redimed_referral",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}