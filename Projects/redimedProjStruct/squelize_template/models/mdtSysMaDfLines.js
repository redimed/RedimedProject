module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysMaDfLines", {
            'MA_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'MA_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUESTION': { 
    type: DataTypes.STRING(200),  
            },
            'VAL1_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'VAL1': { 
    type: DataTypes.STRING(200),  
            },
            'VAL2_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'VAL2': { 
    type: DataTypes.STRING(200),  
            },
            'VAL3_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'VAL3': { 
    type: DataTypes.STRING(200),  
            },
            'VAL4_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'VAL4': { 
    type: DataTypes.STRING(200),  
            },
            'VAL5_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'VAL5': { 
    type: DataTypes.STRING(200),  
            },
            'VAL6_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'VAL6': { 
    type: DataTypes.STRING(200),  
            },
            'YES_NO': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMMENTS': { 
    type: DataTypes.STRING(200),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'GROUP_ID': { 
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
tableName: "sys_ma_df_lines",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}