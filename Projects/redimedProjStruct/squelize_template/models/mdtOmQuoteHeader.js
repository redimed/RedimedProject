module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmQuoteHeader", {
            'QUOTE_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYMENT_TERM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUOTE_DATE': { 
    type: DataTypes.DATE,  
            },
            'QUOTE_NUMBER': { 
    type: DataTypes.STRING(20),  
            },
            'STATUS': { 
    type: DataTypes.STRING(20),  
            },
            'CURR': { 
    type: DataTypes.STRING(20),  
            },
            'BASE_CURR': { 
    type: DataTypes.STRING(20),  
            },
            'RATE_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'RATE': { 
    type: DataTypes.FLOAT,  
            },
            'OM_SETUP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PL_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ATTENTION_FIRSTNAME': { 
    type: DataTypes.STRING(50),  
            },
            'ATTENTION_LASTNAME': { 
    type: DataTypes.STRING(50),  
            },
            'IS_NOT_INCLUDE_TRAVEL_COST': { 
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
                    'REPEAT_AFTER': { 
    type: DataTypes.INTEGER(11),  
            },
            'DAYS_REPEAT': { 
    type: DataTypes.INTEGER(11),  
            },
            'REMIND_BEFORE': { 
    type: DataTypes.INTEGER(11),  
            },
            'SOURCE_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ROOT_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "om_quote_headers",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}