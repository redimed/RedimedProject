module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysMaDfSubquestions", {
            'MA_LINE_SUB_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'QUESTION': { 
    type: DataTypes.STRING(200),  
            },
            'YES_NO': { 
    type: DataTypes.INTEGER(11),  
            },
            'REASON': { 
    type: DataTypes.STRING(200),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'MA_LINE_ID': { 
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
}, {
tableName: "sys_ma_df_subquestions",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}