module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrCalculationOfWorks", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'employee_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_off': { 
    type: DataTypes.DATE,  
            },
            'to_off': { 
    type: DataTypes.DATE,  
            },
            'Day_off': { 
    type: DataTypes.STRING(10),  
            },
            'play_time': { 
    type: DataTypes.FLOAT,  
            },
            'sum_day_off': { 
    type: DataTypes.INTEGER(11),  
            },
            'day_off_type': { 
    type: DataTypes.STRING(10),  
            },
            'percent_salary': { 
    type: DataTypes.INTEGER(11),  
            },
            'note': { 
    type: DataTypes.STRING(200),  
            },
            'isenable': { 
    type: DataTypes.INTEGER(1),  
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
tableName: "hr_calculation_of_work",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}