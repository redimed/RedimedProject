module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtThRequestProgressAssessment", {
            'req_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'telehealth_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'current_symptoms': { 
    type: DataTypes.STRING(100),  
            },
            'new_symptom': { 
    type: DataTypes.STRING(100),  
            },
            'issues_with_duties': { 
    type: DataTypes.STRING(100),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'doctor_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "th_request_progress_assessment",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}