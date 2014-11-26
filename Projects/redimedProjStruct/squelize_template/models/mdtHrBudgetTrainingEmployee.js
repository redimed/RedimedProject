module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrBudgetTrainingEmployee", {
            'budget_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'from_date_budget': { 
    type: DataTypes.DATE,  
            },
            'to_date_budget': { 
    type: DataTypes.DATE,  
            },
            'notes_budget': { 
    type: DataTypes.STRING(250),  
            },
            'employee_id_budget': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'budget': { 
    type: DataTypes.DECIMAL(),  
            },
}, {
tableName: "hr_budget_training_employee",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}