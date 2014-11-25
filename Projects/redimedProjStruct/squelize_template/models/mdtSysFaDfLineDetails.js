module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysFaDfLineDetails", {
            'DETAIL_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUESTION': { 
    type: DataTypes.STRING(200),  
            },
            'VAL1_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'VAL1_ISVALUE': { 
    type: DataTypes.INTEGER(11),  
            },
            'VAL1_VALUE': { 
    type: DataTypes.STRING(100),  
            },
            'VAL1_ISCHECKBOX': { 
    type: DataTypes.INTEGER(11),  
            },
            'VAL1_CHECKBOX': { 
    type: DataTypes.STRING(10),  
            },
            'VAL2_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'VAL2_ISVALUE': { 
    type: DataTypes.INTEGER(11),  
            },
            'VAL2_VALUE': { 
    type: DataTypes.STRING(100),  
            },
            'VAL2_ISCHECKBOX': { 
    type: DataTypes.INTEGER(11),  
            },
            'VAL2_CHECKBOX': { 
    type: DataTypes.STRING(10),  
            },
            'COMMENTS': { 
    type: DataTypes.STRING(200),  
            },
            'PICTURE': { 
    type: DataTypes.BLOB,  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
            'VAL1_ISCOMMENT_WHEN_YES': { 
    type: DataTypes.INTEGER(11),  
            },
            'VAL1_ISCOMMENT_WHEN_NO': { 
    type: DataTypes.INTEGER(11),  
            },
            'VAL2_ISCOMMENT_WHEN_YES': { 
    type: DataTypes.INTEGER(11),  
            },
            'VAL2_ISCOMMENT_WHEN_NO': { 
    type: DataTypes.INTEGER(11),  
            },
            'IsCommentText': { 
    type: DataTypes.INTEGER(11),  
            },
            'LineTestRefer': { 
    type: DataTypes.INTEGER(11),  
            },
            'VAL1_VALUE_IS_NUMBER': { 
    type: DataTypes.INTEGER(11),  
            },
            'VAL2_VALUE_IS_NUMBER': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_fa_df_line_details",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}