module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrFixElement", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'fix_from': { 
    type: DataTypes.DATE,  
            },
            'fix_to': { 
    type: DataTypes.DATE,  
            },
            'element_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'employee_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'amount': { 
    type: DataTypes.FLOAT,  
                defaultValue: '0',
        },
            'curr_code': { 
    type: DataTypes.STRING(10),  
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
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'contract_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'description': { 
    type: DataTypes.STRING(200),  
            },
}, {
tableName: "hr_fix_element",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}