module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrDegree", {
            'DEGREE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'DEGREE_NAME': { 
    type: DataTypes.STRING(200),  
            },
            'FROMDATE_degree': { 
    type: DataTypes.DATE,  
            },
            'TODATE_degree': { 
    type: DataTypes.DATE,  
            },
            'NOTES_degree': { 
    type: DataTypes.STRING(200),  
            },
            'Files_degree': { 
    type: DataTypes.STRING(200),  
            },
            'School_ID_degree': { 
    type: DataTypes.INTEGER(11),  
            },
            'Employee_ID_degree': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'Candidate_ID_degree': { 
    type: DataTypes.INTEGER(11),  
            },
            'Degree_Type': { 
    type: DataTypes.INTEGER(11),  
            },
            'exp_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "hr_degree",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}