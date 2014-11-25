module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysFaDfLine", {
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'SECTION_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FA_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUESTION': { 
    type: DataTypes.STRING(200),  
            },
            'PICTURE': { 
    type: DataTypes.BLOB,  
            },
            'ISSCORE1': { 
    type: DataTypes.INTEGER(11),  
            },
            'SCORE_TYPE1': { 
    type: DataTypes.INTEGER(11),  
            },
            'SCORE1': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISRATING1': { 
    type: DataTypes.INTEGER(11),  
            },
            'RATING_ID1': { 
    type: DataTypes.INTEGER(11),  
            },
            'RATING_VALUE1': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMMENTS': { 
    type: DataTypes.STRING(200),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISSCORE2': { 
    type: DataTypes.INTEGER(11),  
            },
            'SCORE_TYPE2': { 
    type: DataTypes.INTEGER(11),  
            },
            'SCORE2': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISRATING2': { 
    type: DataTypes.INTEGER(11),  
            },
            'RATING_ID2': { 
    type: DataTypes.INTEGER(11),  
            },
            'RATING_VALUE2': { 
    type: DataTypes.INTEGER(11),  
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
                    'IsCommentsText': { 
    type: DataTypes.INTEGER(11),  
            },
            'LineType': { 
    type: DataTypes.INTEGER(11),  
            },
            'RATE1': { 
    type: DataTypes.STRING(20),  
            },
            'RATE2': { 
    type: DataTypes.STRING(20),  
            },
            'VAL1_NAME_HEADER': { 
    type: DataTypes.STRING(50),  
            },
            'VAL1_VALUE_HEADER': { 
    type: DataTypes.STRING(50),  
            },
            'VAL2_NAME_HEADER': { 
    type: DataTypes.STRING(50),  
            },
            'VAL2_VALUE_HEADER': { 
    type: DataTypes.STRING(50),  
            },
            'IS_SHOW_RANKING_TABLE': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_fa_df_lines",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}