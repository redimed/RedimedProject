module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysMhDfLineSubquestion", {
            'MH_LINE_SUB_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'MH_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUESTION': { 
    type: DataTypes.STRING(200),  
            },
            'YES_NO': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'ISCOMMENT_WHEN_YES': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISCOMMENT_WHEN_NO': { 
    type: DataTypes.INTEGER(11),  
            },
            'Comments': { 
    type: DataTypes.STRING(200),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "sys_mh_df_line_subquestions",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}