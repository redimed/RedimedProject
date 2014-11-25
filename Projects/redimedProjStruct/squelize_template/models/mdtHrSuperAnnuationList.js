module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrSuperAnnuationList", {
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
                'LAST_UPDATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "hr_super_annuation_list",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}