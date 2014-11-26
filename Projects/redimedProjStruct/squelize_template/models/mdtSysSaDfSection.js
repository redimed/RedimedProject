module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysSaDfSection", {
            'SECTION_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'SA_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SECTION_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'ORD': { 
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
        }, {
tableName: "sys_sa_df_sections",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}