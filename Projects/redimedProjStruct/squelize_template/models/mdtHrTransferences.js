module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrTransferences", {
            'transfer_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'date_effected': { 
    type: DataTypes.DATE,  
            },
            'new_company_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'new_site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'new_dept_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'is_disable': { 
    type: DataTypes.INTEGER(11),  
            },
            'reason_transference': { 
    type: DataTypes.STRING(255),  
            },
            'description_transference': { 
    type: DataTypes.STRING(255),  
            },
            'notes_transference': { 
    type: DataTypes.STRING(255),  
            },
            'employee_id_transference': { 
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
            'decision_number': { 
    type: DataTypes.STRING(50),  
            },
}, {
tableName: "hr_transference",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}