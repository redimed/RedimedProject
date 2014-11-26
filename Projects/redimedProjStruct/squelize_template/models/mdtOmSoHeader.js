module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmSoHeader", {
            'SO_HEADER_ID': { 
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
            'ORDER_DATE': { 
    type: DataTypes.DATE,  
            },
            'ORDER_NUMBER': { 
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
            'QUOTE_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'BASE_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'TAX_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'TAX_BASE_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'DESCRIPTION': { 
    type: DataTypes.TEXT,  
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
                    'PO_NUMBER': { 
    type: DataTypes.STRING(20),  
            },
}, {
tableName: "om_so_headers",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}