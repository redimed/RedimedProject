module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrReportVariables", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'report_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'variable_order': { 
    type: DataTypes.INTEGER(11),  
            },
            'variable_name': { 
    type: DataTypes.STRING(50),  
            },
            'variable_type': { 
    type: DataTypes.STRING(50),  
            },
            'is_Show': { 
    type: DataTypes.INTEGER(11),  
            },
            'is_Check': { 
    type: DataTypes.INTEGER(11),  
            },
            'is_Use_In_Store': { 
    type: DataTypes.INTEGER(11),  
            },
            'LOV_value_group': { 
    type: DataTypes.STRING(50),  
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
}, {
tableName: "hr_report_variable",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}