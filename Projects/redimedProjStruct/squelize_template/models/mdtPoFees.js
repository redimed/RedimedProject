module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoFees", {
            'FEE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'FEE_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'FEE_CURR': { 
    type: DataTypes.STRING(5),  
            },
            'FEE_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_T1_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_T2_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_T3_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_T4_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_T5_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_T6_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_T7_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_T8_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_T9_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE_T10_ID': { 
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
tableName: "po_fees",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}