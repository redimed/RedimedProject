module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrEmployeeRelations", {
            'EmployeeRelation_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'FirstName_relation': { 
    type: DataTypes.STRING(200),  
            },
            'LastName_relation': { 
    type: DataTypes.STRING(200),  
            },
            'Birthday_relation': { 
    type: DataTypes.DATE,  
            },
            'Relationship_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SocialSecurity_relation': { 
    type: DataTypes.STRING(200),  
            },
            'Education_relation': { 
    type: DataTypes.STRING(200),  
            },
            'Career_relation': { 
    type: DataTypes.STRING(200),  
            },
            'Address_relation': { 
    type: DataTypes.STRING(200),  
            },
            'Phone_relation': { 
    type: DataTypes.STRING(200),  
            },
            'Biography_relation': { 
    type: DataTypes.STRING(200),  
            },
            'Note_relation': { 
    type: DataTypes.STRING(200),  
            },
            'Employee_ID_relation': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
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
            'emergency': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_employee_relation",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}