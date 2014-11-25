module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtApPayments", {
            'CLIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYMENT_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                        defaultValue: 0,
        },
            'PAYMENT_TYPE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYMENT_NO': { 
    type: DataTypes.STRING(50),  
            },
            'PAYMENT_DATE': { 
    type: DataTypes.DATE,  
            },
            'PERSON_NAME': { 
    type: DataTypes.STRING(100),  
            },
            'PERSON_PHONE': { 
    type: DataTypes.STRING(50),  
            },
            'PERSON_ADDR': { 
    type: DataTypes.STRING(200),  
            },
            'PERSON_ID_CARD': { 
    type: DataTypes.STRING(15),  
            },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PERIOD_CODE': { 
    type: DataTypes.STRING(10),  
            },
            'SOB_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CURR': { 
    type: DataTypes.STRING(10),  
            },
            'RATE_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'RATE': { 
    type: DataTypes.FLOAT,  
            },
            'AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'BASE_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'TAX_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_RATE': { 
    type: DataTypes.FLOAT,  
            },
            'TAX_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'TAX_BASE_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'FUNCTION_TYPE': { 
    type: DataTypes.STRING(50),  
            },
            'BANK_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'BANK_RANCH_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'BANK_BRANCH_ACCOUNT_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACCOUNT_BANK_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACCOUNT_BANK_CODE': { 
    type: DataTypes.STRING(50),  
            },
            'STATUS': { 
    type: DataTypes.STRING(20),  
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
tableName: "ap_payment",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}