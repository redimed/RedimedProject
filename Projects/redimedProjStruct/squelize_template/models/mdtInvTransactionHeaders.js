module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtInvTransactionHeaders", {
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'TRANSACTION_DATE': { 
    type: DataTypes.DATE,  
            },
            'TRANSACTION_TYPE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TRANSACTION_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORG_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SUB_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TRANSFER_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TRANSFER_ORG_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TRANSFER_SUB_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PERIOD_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'INVENTORY_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'INVOICE_NO': { 
    type: DataTypes.STRING(20),  
            },
            'INVOICE_DATE': { 
    type: DataTypes.DATE,  
            },
            'INVOICE_SERI': { 
    type: DataTypes.STRING(20),  
            },
            'ISADJ': { 
    type: DataTypes.INTEGER(11),  
            },
            'ADJ_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CURR': { 
    type: DataTypes.STRING(10),  
            },
            'CURR_RATE': { 
    type: DataTypes.FLOAT,  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATION_DATE': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "inv_transaction_headers",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}