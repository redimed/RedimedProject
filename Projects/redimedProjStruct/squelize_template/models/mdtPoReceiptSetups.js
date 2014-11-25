module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoReceiptSetups", {
            'RECEIPT_SETUP_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'RECEIPT_CODE': { 
    type: DataTypes.STRING(50),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'ISEXPENSE': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_T1_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_T2_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_T3_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_T4_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_T5_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_T6_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_T7_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_T8_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_T9_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXP_T10_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_T1_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_T2_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_T3_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_T4_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_T5_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_T6_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_T7_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_T8_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_T9_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PAYABLE_T10_ID': { 
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
}, {
tableName: "po_receipt_setups",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}