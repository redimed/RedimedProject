module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmSetups", {
            'OM_SETUP_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'SETUP_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(200),  
            },
            'CURR': { 
    type: DataTypes.STRING(20),  
            },
            'RATE_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'TAX_ID': { 
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
            'CREATION_DATE': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
            'PRICE_LIST_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYMENT_TERM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'RATE': { 
    type: DataTypes.FLOAT,  
            },
}, {
tableName: "om_setups",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}