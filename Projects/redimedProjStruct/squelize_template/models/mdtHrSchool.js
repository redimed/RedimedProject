module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrSchool", {
            'School_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'FromDate_school': { 
    type: DataTypes.DATE,  
            },
            'ToDate_school': { 
    type: DataTypes.DATE,  
            },
            'SchoolCode_school': { 
    type: DataTypes.INTEGER(11),  
            },
            'Description_school': { 
    type: DataTypes.STRING(200),  
            },
            'Note_school': { 
    type: DataTypes.STRING(200),  
            },
            'Employee_ID_school': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'Candidate_ID_school': { 
    type: DataTypes.INTEGER(11),  
            },
            'Professional_Id_school': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_school",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}