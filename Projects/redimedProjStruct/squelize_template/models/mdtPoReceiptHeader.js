module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoReceiptHeader", {
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
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
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'BILL_TO_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SHIP_TO_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORG_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SUB_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
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
            'PERIOD_CODE': { 
    type: DataTypes.STRING(10),  
            },
            'STATUS': { 
    type: DataTypes.STRING(20),  
            },
            'INVOICE_NO': { 
    type: DataTypes.STRING(20),  
            },
            'INVOICE_DATE': { 
    type: DataTypes.DATE,  
            },
            'INVOICE_SERIAL': { 
    type: DataTypes.STRING(20),  
            },
            'PAYMENT_TERM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PO_METHOD_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "po_receipt_headers",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}