module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtApBankBranchs", {
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
            primaryKey: true,
                    },
            'BANK_BRANCH_CODE': { 
    type: DataTypes.STRING(100),  
            },
            'BANK_BRANCH_NAME': { 
    type: DataTypes.STRING(250),  
            },
            'ADDRESS': { 
    type: DataTypes.STRING(250),  
            },
            'PROVINCE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'COUNTRY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TEL': { 
    type: DataTypes.STRING(50),  
            },
            'FAX': { 
    type: DataTypes.STRING(50),  
            },
            'WEBSITE': { 
    type: DataTypes.STRING(50),  
            },
            'EMAIL': { 
    type: DataTypes.STRING(50),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(500),  
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
tableName: "ap_bank_branchs",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}