module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysMhDfLines", {
            'MH_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'GROUP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'MH_DF_ID': { 
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
                defaultValue: 0,
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
            'ISDETAILS_ANSWER_ONLY': { 
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
            'ISDetails_Answer_IfYes': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_mh_df_lines",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}