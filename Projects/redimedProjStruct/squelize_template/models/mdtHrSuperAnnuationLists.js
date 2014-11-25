module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrSuperAnnuationLists", {
            'super_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'super_name': { 
    type: DataTypes.STRING(200),  
            },
            'ABN': { 
    type: DataTypes.STRING(200),  
            },
            'BSB': { 
    type: DataTypes.STRING(200),  
            },
            'bank_account': { 
    type: DataTypes.STRING(200),  
            },
            'bank_name': { 
    type: DataTypes.STRING(200),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATION_DATE': { 
    type: DataTypes.DATE,  
            },
            'LAST_UPDATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'LAST_UPDATE_DATE': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "hr_super_annuation_list",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}