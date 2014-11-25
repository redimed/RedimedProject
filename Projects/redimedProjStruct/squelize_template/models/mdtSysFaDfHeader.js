module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysFaDfHeader", {
            'FA_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'FA_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'ITEM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'Risk': { 
    type: DataTypes.STRING(10),  
            },
            'Comments': { 
    type: DataTypes.STRING(200),  
            },
            'Recommend': { 
    type: DataTypes.STRING(10),  
            },
            'Att_Flexibility': { 
    type: DataTypes.INTEGER(11),  
            },
            'Att_Core_Stability': { 
    type: DataTypes.INTEGER(11),  
            },
            'Att_Wirst_Elbow_func': { 
    type: DataTypes.INTEGER(11),  
            },
            'Att_Shoulder_func': { 
    type: DataTypes.INTEGER(11),  
            },
            'Att_Lower_Limb_func': { 
    type: DataTypes.INTEGER(11),  
            },
            'Att_Balance': { 
    type: DataTypes.INTEGER(11),  
            },
            'ASSESSED_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ASSESSED_SIGN': { 
    type: DataTypes.BLOB,  
            },
            'ASSESSED_DATE': { 
    type: DataTypes.DATE,  
            },
            'ASSESSED_NAME': { 
    type: DataTypes.STRING(100),  
            },
}, {
tableName: "sys_fa_df_headers",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}