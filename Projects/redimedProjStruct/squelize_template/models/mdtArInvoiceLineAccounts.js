module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtArInvoiceLineAccounts", {
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
            },
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'LINE_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'DISTRIBUTION_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'DEBIT_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'BASE_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'DEBIT_ACC_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_T10': { 
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
tableName: "ar_invoice_line_accounts",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}