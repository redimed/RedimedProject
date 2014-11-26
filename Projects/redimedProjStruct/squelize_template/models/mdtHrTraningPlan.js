module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrTraningPlan", {
            'plan_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'from_date_p': { 
    type: DataTypes.DATE,  
            },
            'to_date_p': { 
    type: DataTypes.DATE,  
            },
            'budget_traning_plan': { 
    type: DataTypes.DECIMAL(),  
            },
            'content_traning_plan': { 
    type: DataTypes.STRING(255),  
            },
            'quantity_emloyee_traning_plan': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "hr_traning_plan",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}