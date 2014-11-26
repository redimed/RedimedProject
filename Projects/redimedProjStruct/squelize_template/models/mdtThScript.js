module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtThScript", {
            'ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'TELEHEALTH_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'prescriber': { 
    type: DataTypes.STRING(50),  
            },
            'scriptNum': { 
    type: DataTypes.BIGINT(20),  
            },
            'Medicare': { 
    type: DataTypes.STRING(100),  
            },
            'isRefNo': { 
    type: DataTypes.INTEGER(11),  
            },
            'EntitlementNo': { 
    type: DataTypes.STRING(100),  
            },
            'isSafety': { 
    type: DataTypes.INTEGER(11),  
            },
            'isConcessional': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPBS': { 
    type: DataTypes.INTEGER(11),  
            },
            'isRPBS': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBrand': { 
    type: DataTypes.INTEGER(11),  
            },
            'pharmacist': { 
    type: DataTypes.STRING(400),  
            },
            'doctorSign': { 
    type: DataTypes.BLOB,  
            },
            'doctordate': { 
    type: DataTypes.DATE,  
            },
            'patientSign': { 
    type: DataTypes.BLOB,  
            },
            'patientDate': { 
    type: DataTypes.DATE,  
            },
            'agentAddress': { 
    type: DataTypes.STRING(150),  
            },
            'AssessmentName': { 
    type: DataTypes.STRING(100),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'AssessmentId': { 
    type: DataTypes.STRING(50),  
            },
}, {
tableName: "th_scripts",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}