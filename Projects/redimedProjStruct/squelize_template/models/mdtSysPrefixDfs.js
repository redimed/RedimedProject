module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysPrefixDfs", {
            'FORM_CODE': { 
    type: DataTypes.STRING(10),  
            primaryKey: true,
                        defaultValue: ,
        },
            'SEG1_LOOKUPHEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SEG2_LOOKUPHEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SEG3_LOOKUPHEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SEG4_LOOKUPHEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SEG5_LOOKUPHEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SEG6_LOOKUPHEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SEG7_LOOKUPHEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SEG8_LOOKUPHEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SEG9_LOOKUPHEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SEG10_LOOKUPHEADER_ID': { 
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
tableName: "sys_prefix_df",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}