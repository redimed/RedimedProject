module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrContracts", {
            'contract_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'employee_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'contract_number': { 
    type: DataTypes.STRING(200),  
            },
            'from_date': { 
    type: DataTypes.DATE,  
            },
            'to_date': { 
    type: DataTypes.DATE,  
            },
            'contract_type_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'salaried': { 
    type: DataTypes.DECIMAL(),  
            },
            'note': { 
    type: DataTypes.STRING(200),  
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
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'files': { 
    type: DataTypes.STRING(200),  
            },
}, {
tableName: "hr_contract",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}