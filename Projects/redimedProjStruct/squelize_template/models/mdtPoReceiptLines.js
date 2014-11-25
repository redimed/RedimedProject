module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoReceiptLines", {
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PO_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PO_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'RECEIPT_NO': { 
    type: DataTypes.STRING(20),  
            },
            'RECEIPT_DATE': { 
    type: DataTypes.DATE,  
            },
            'RECEIPT_SETUP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_T1_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_T2_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_T3_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_T4_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_T5_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_T6_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_T7_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_T8_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_T9_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_T10_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'ORG_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SUB_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ITEM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ITEM_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'ITEM_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'ITEM_DESC': { 
    type: DataTypes.STRING(100),  
            },
            'TRANSACTION_QUANTITY': { 
    type: DataTypes.FLOAT,  
            },
            'TRANSACTION_COST': { 
    type: DataTypes.FLOAT,  
            },
            'TRANSACTION_UOM': { 
    type: DataTypes.STRING(10),  
            },
            'PRIMARY_UOM': { 
    type: DataTypes.STRING(10),  
            },
            'ACTUAL_COST': { 
    type: DataTypes.FLOAT,  
            },
            'PRIMARY_QUANTITY': { 
    type: DataTypes.FLOAT,  
            },
            'PO_COST': { 
    type: DataTypes.FLOAT,  
            },
            'BASE_PO_COST': { 
    type: DataTypes.FLOAT,  
            },
            'FEE_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'TAX_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'NON_RETURN_TAX_AMOUNT': { 
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
            'CURR_CODE': { 
    type: DataTypes.STRING(5),  
            },
            'BASE_CURR': { 
    type: DataTypes.STRING(5),  
            },
            'RATE_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'RATE': { 
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
tableName: "po_receipt_lines",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}