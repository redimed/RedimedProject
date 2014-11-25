module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrVisaPassports", {
            'VisaPassPort_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Type_ID_visa': { 
    type: DataTypes.INTEGER(11),  
            },
            'VisaPassportNo': { 
    type: DataTypes.STRING(200),  
            },
            'IssueDate': { 
    type: DataTypes.DATE,  
            },
            'ExpireDate': { 
    type: DataTypes.DATE,  
            },
            'LaborNo_visa': { 
    type: DataTypes.STRING(200),  
            },
            'FromDate_visa': { 
    type: DataTypes.DATE,  
            },
            'ToDate_visa': { 
    type: DataTypes.DATE,  
            },
            'Note_visa': { 
    type: DataTypes.STRING(200),  
            },
            'Employee_ID_visa': { 
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
}, {
tableName: "hr_visa_passport",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}