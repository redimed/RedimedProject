module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtApBankBranchAccount", {
            'CLIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'BANK_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'BANK_BRANCH_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'BANK_ACCOUNT_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'BANK_ACCOUNT_CODE': { 
    type: DataTypes.STRING(100),  
            },
            'BANK_TYPE': { 
    type: DataTypes.STRING(50),  
            },
            'CURR': { 
    type: DataTypes.STRING(10),  
            },
            'ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(500),  
            },
            'T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'LAST_UPDATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "ap_bank_branch_accounts",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}