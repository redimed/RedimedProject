module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysFaDfComment", {
            'FA_COMMENT_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'NAME': { 
    type: DataTypes.STRING(50),  
            },
            'VALUE': { 
    type: DataTypes.STRING(20),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'Comment_Type': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_fa_df_comments",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}