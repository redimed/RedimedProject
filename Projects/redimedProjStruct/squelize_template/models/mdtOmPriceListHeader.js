module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmPriceListHeader", {
            'PL_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'PRICE_LIST_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'PRICE_LIST_NAME': { 
    type: DataTypes.STRING(200),  
            },
            'START_DATE': { 
    type: DataTypes.DATE,  
            },
            'END_DATE': { 
    type: DataTypes.DATE,  
            },
            'STATUS': { 
    type: DataTypes.STRING(20),  
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
tableName: "om_price_list_headers",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}