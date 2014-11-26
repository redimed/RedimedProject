module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrReward", {
            'reward_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'decision_number': { 
    type: DataTypes.STRING(200),  
            },
            'decision_date': { 
    type: DataTypes.DATE,  
            },
            'reward_form': { 
    type: DataTypes.STRING(250),  
            },
            'reason': { 
    type: DataTypes.STRING(250),  
            },
            'date_effected': { 
    type: DataTypes.DATE,  
            },
            'money': { 
    type: DataTypes.DECIMAL(),  
            },
            'note': { 
    type: DataTypes.STRING(250),  
            },
            'employee_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'company_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'dept_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'employee_code': { 
    type: DataTypes.STRING(200),  
            },
            'first_name': { 
    type: DataTypes.STRING(200),  
            },
            'last_name': { 
    type: DataTypes.STRING(200),  
            },
}, {
tableName: "hr_reward",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}