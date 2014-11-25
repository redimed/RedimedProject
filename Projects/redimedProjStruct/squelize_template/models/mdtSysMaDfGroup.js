module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysMaDfGroup", {
            'GROUP_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'GROUP_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'QUEST_DF_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'USER_TYPE': { 
    type: DataTypes.STRING(10),  
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
                    'Description': { 
    type: DataTypes.STRING(2000),  
            },
}, {
tableName: "sys_ma_df_group",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}