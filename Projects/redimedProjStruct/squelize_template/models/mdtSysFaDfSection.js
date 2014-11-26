module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysFaDfSection", {
            'SECTION_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'FA_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SECTION_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'USER_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'SECTION_TYPE': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_fa_df_sections",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}