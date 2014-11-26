module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrCalculatorSalary", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'cal_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'cal_date': { 
    type: DataTypes.DATE,  
            },
            'employee_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'element_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'start_value': { 
    type: DataTypes.DECIMAL(),  
                defaultValue: '0.000',
        },
            'leave_value': { 
    type: DataTypes.DECIMAL(),  
                defaultValue: '0.000',
        },
            'base_value': { 
    type: DataTypes.DECIMAL(),  
                defaultValue: '0.000',
        },
            'calu_rate': { 
    type: DataTypes.DECIMAL(),  
                defaultValue: '0.000',
        },
            'period_hours': { 
    type: DataTypes.DECIMAL(),  
                defaultValue: '0.000',
        },
            'amount': { 
    type: DataTypes.DECIMAL(),  
                defaultValue: '0.000',
        },
            'ytd': { 
    type: DataTypes.DECIMAL(),  
                defaultValue: '0.000',
        },
            'ytd_hours': { 
    type: DataTypes.DECIMAL(),  
            },
}, {
tableName: "hr_calculator_salary",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}