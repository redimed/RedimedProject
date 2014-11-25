module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrExceptionElements", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'ex_year': { 
    type: DataTypes.INTEGER(11),  
            },
            'ex_period': { 
    type: DataTypes.STRING(7),  
            },
            'element_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'employee_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'cost': { 
    type: DataTypes.FLOAT,  
                defaultValue: 0,
        },
            'curr_code': { 
    type: DataTypes.STRING(3),  
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
tableName: "hr_exception_element",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}