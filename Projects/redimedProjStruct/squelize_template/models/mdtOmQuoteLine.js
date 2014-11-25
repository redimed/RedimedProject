module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmQuoteLine", {
            'QUOTE_LINE_ID': { 
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
            'FROM_TRANSACTION_QUANTITY': { 
    type: DataTypes.INTEGER(11),  
            },
            'TO_TRANSACTION_QUANTITY': { 
    type: DataTypes.INTEGER(11),  
            },
            'TRANSACTION_PRICE': { 
    type: DataTypes.FLOAT,  
            },
            'QUOTE_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISONSITE': { 
    type: DataTypes.INTEGER(11),  
            },
            'OM_SITE_ID': { 
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
                    'IS_CAL_AMOUNT_WITHOUT_QUANTITY': { 
    type: DataTypes.INTEGER(11),  
            },
            'IS_CAL_AMOUNT_LATER': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "om_quote_lines",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}