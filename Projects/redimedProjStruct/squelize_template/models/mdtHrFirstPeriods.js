module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrFirstPeriods", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'element_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'employee_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'period_value': { 
    type: DataTypes.FLOAT,  
            },
            'enable': { 
    type: DataTypes.INTEGER(11),  
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
            'period_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_first_period",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}