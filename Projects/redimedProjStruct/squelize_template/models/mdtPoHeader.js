module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoHeader", {
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
            'PO_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'PO_NO': { 
    type: DataTypes.STRING(20),  
            },
            'PO_DATE': { 
    type: DataTypes.DATE,  
            },
            'PO_METHOD_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CONTRACT_NO': { 
    type: DataTypes.STRING(20),  
            },
            'CONTRACT_DATE': { 
    type: DataTypes.DATE,  
            },
            'BILL_TO_SITE': { 
    type: DataTypes.INTEGER(11),  
            },
            'SHIP_TO_SITE': { 
    type: DataTypes.INTEGER(11),  
            },
            'VENDOR_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'VENDOR_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CURR': { 
    type: DataTypes.STRING(5),  
            },
            'CURR_RATE_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'CURR_RATE': { 
    type: DataTypes.FLOAT,  
            },
            'BASE_CURR': { 
    type: DataTypes.STRING(5),  
            },
            'CONTACT_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'CONTACT_NO': { 
    type: DataTypes.STRING(15),  
            },
            'CONTACT_EMAIL': { 
    type: DataTypes.STRING(50),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'status': { 
    type: DataTypes.STRING(20),  
            },
            'TOTAL_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'BASE_TOTAL_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'PAYMENT_TERM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'MFG_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PACKING_NOTE': { 
    type: DataTypes.STRING(100),  
            },
            'MANKING_NOTE': { 
    type: DataTypes.STRING(100),  
            },
            'STORAGE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "po_headers",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}