module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtApInvoiceLineAccount", {
            'CLIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'INVOICE_LINE_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'INVOICE_ID': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'INVOICE_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'DISTRIBUTION_TYPE': { 
    type: DataTypes.STRING(50),  
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
            'DESCRIPTION': { 
    type: DataTypes.STRING(500),  
            },
            'DEBIT_ACC_ID_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_ID_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_ID_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_ID_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_ID_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_ID_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_ID_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_ID_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_ID_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'DEBIT_ACC_ID_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREDIT_ACC_ID_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'LAST_UPDATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "ap_invoice_line_accounts",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}