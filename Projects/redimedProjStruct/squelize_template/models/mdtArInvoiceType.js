module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtArInvoiceType", {
            'CLIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TYPE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'TYPE_NAME': { 
    type: DataTypes.STRING(250),  
            },
            'ACC_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'FUNCTION_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'REV_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PREFIX': { 
    type: DataTypes.STRING(10),  
            },
            'CURR': { 
    type: DataTypes.STRING(10),  
            },
            'TAX_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(1),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(500),  
            },
            'REV_ACC_ID_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'REV_ACC_ID_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'REV_ACC_ID_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'REV_ACC_ID_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'REV_ACC_ID_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'REV_ACC_ID_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'REV_ACC_ID_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'REV_ACC_ID_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'REV_ACC_ID_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'REV_ACC_ID_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'REC_ACC_ID_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_ACC_ID_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'LAST_UPDATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "ar_invoice_types",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}