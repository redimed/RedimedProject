module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmSoLine", {
            'SO_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'ITEM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ITEM_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'ITEM_NAME': { 
    type: DataTypes.STRING(5000),  
            },
            'TRANSACTION_UOM': { 
    type: DataTypes.STRING(20),  
            },
            'TRANSACTION_QUANTITY': { 
    type: DataTypes.INTEGER(11),  
            },
            'TRANSACTION_PRICE': { 
    type: DataTypes.FLOAT,  
            },
            'TRANSACTION_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'SO_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUOTE_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUOTE_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'NOTES': { 
    type: DataTypes.TEXT,  
            },
            'OM_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACTUAL_QUANTITY': { 
    type: DataTypes.INTEGER(11),  
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
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'ISONSITE': { 
    type: DataTypes.INTEGER(11),  
            },
            'OTHER_QUANTITY': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "om_so_lines",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}