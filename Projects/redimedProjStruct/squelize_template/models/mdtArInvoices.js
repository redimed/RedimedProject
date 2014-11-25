module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtArInvoices", {
            'CLIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                        defaultValue: 0,
        },
            'VOUCHER_NO': { 
    type: DataTypes.STRING(50),  
            },
            'VOUCHER_DATE': { 
    type: DataTypes.DATE,  
            },
            'TYPE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACC_TYPE': { 
    type: DataTypes.STRING(50),  
            },
            'ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'INVOICE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'INVOICE_NO': { 
    type: DataTypes.STRING(50),  
            },
            'INVOICE_DATE': { 
    type: DataTypes.DATE,  
            },
            'INVOICE_SERI': { 
    type: DataTypes.STRING(50),  
            },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PERIOD_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PERIOD_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'PAYMENT_TERM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CURR': { 
    type: DataTypes.STRING(10),  
            },
            'RATE_TYPE': { 
    type: DataTypes.STRING(50),  
            },
            'RATE_DATE': { 
    type: DataTypes.DATE,  
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
            'STATUS': { 
    type: DataTypes.STRING(20),  
            },
            'FUNCTION_TYPE': { 
    type: DataTypes.STRING(20),  
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
tableName: "ar_invoices",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}