module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmPriceListLine", {
            'PL_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
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
            'UOM': { 
    type: DataTypes.STRING(10),  
            },
            'PRICE': { 
    type: DataTypes.FLOAT,  
            },
            'START_DATE': { 
    type: DataTypes.DATE,  
            },
            'END_DATE': { 
    type: DataTypes.DATE,  
            },
            'DESCRIPTION': { 
    type: DataTypes.TEXT,  
            },
            'FROM_QUANTITY': { 
    type: DataTypes.INTEGER(11),  
            },
            'TO_QUANTITY': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
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
        }, {
tableName: "om_price_list_lines",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}