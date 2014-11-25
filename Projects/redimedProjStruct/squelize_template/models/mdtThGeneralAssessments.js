module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtThGeneralAssessments", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'cal_id': { 
    type: DataTypes.BIGINT(20),  
            },
            'symptomology': { 
    type: DataTypes.STRING(200),  
            },
            'examiantion': { 
    type: DataTypes.STRING(200),  
            },
            'diffDiagnosis': { 
    type: DataTypes.STRING(200),  
            },
            'medication': { 
    type: DataTypes.STRING(200),  
            },
            'physio': { 
    type: DataTypes.STRING(200),  
            },
            'dutyrestriction': { 
    type: DataTypes.STRING(200),  
            },
            'recommendations': { 
    type: DataTypes.STRING(200),  
            },
            'followup': { 
    type: DataTypes.STRING(200),  
            },
            'referrals': { 
    type: DataTypes.STRING(200),  
            },
            'telehealth_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Name': { 
    type: DataTypes.STRING(100),  
            },
            'Address': { 
    type: DataTypes.STRING(100),  
            },
            'Email': { 
    type: DataTypes.STRING(100),  
            },
            'registionNo': { 
    type: DataTypes.STRING(100),  
            },
            'Phone': { 
    type: DataTypes.STRING(15),  
            },
            'examDate': { 
    type: DataTypes.DATE,  
            },
            'signature': { 
    type: DataTypes.BLOB,  
            },
            'reportlocal': { 
    type: DataTypes.STRING(30),  
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
    type: DataTypes.STRING(50),  
                defaultValue: General Assessment,
        },
}, {
tableName: "th_general_assessment",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}