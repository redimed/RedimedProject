module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoReceiptTaxes", {
            'TAX_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_RATE': { 
    type: DataTypes.FLOAT,  
            },
            'RETURN_RATE': { 
    type: DataTypes.FLOAT,  
            },
            'TAX_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'NON_RETURN_TAX_AMOUNT': { 
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
tableName: "po_receipt_taxes",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}