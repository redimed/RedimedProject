module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtInvTransactionLines", {
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'LINE_ID': { 
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
            'ITEM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TRANSACTION_QUANLITY': { 
    type: DataTypes.FLOAT,  
            },
            'TRANSACTION_UOM': { 
    type: DataTypes.STRING(10),  
            },
            'TRANSACTION_COST': { 
    type: DataTypes.FLOAT,  
            },
            'PRIMARY_QUANLITY': { 
    type: DataTypes.FLOAT,  
            },
            'PRIMARY_ISSUE_QUANTITY': { 
    type: DataTypes.FLOAT,  
            },
            'ISREMAIN': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRIMARY_UOM': { 
    type: DataTypes.STRING(10),  
            },
            'ACTUAL_COST': { 
    type: DataTypes.FLOAT,  
            },
            'TRANSACTION_SIGN': { 
    type: DataTypes.INTEGER(11),  
            },
            'TRANSACTION_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'ACTUAL_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'PERIODIC_COST': { 
    type: DataTypes.FLOAT,  
            },
            'PERIODIC_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'LOT_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'LOT_NO': { 
    type: DataTypes.STRING(20),  
            },
            'EXP_DATE': { 
    type: DataTypes.DATE,  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'ISADJ': { 
    type: DataTypes.INTEGER(11),  
            },
            'ADJ_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ADJ_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISSUE_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SOURCE_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SOURCE_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SOURCE_NAME': { 
    type: DataTypes.STRING(20),  
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
tableName: "inv_transaction_lines",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}