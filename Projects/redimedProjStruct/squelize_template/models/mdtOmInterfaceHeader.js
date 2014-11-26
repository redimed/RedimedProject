module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmInterfaceHeader", {
            'CLIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'VOUCHER_NO': { 
    type: DataTypes.STRING(50),  
            },
            'VOUCHER_DATE': { 
    type: DataTypes.DATE,  
            },
            'INVOICE_NO': { 
    type: DataTypes.STRING(50),  
            },
            'INVOICE_DATE': { 
    type: DataTypes.DATE,  
            },
            'INVOICE_SERI': { 
    type: DataTypes.STRING(50),  
            },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PERIOD_CODE': { 
    type: DataTypes.STRING(10),  
            },
            'CURR': { 
    type: DataTypes.STRING(10),  
            },
            'RATE': { 
    type: DataTypes.FLOAT,  
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
            'INVOICE_TYPE': { 
    type: DataTypes.STRING(50),  
            },
            'STATUS': { 
    type: DataTypes.STRING(20),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(500),  
            },
            'SOURCE_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "om_interface_headers",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}