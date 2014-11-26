module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysSaDfLine", {
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'SECTION_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SA_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'NAME': { 
    type: DataTypes.INTEGER(11),  
            },
            'VALUE_RIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'VALUE_LEFT': { 
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
        }, {
tableName: "sys_sa_df_lines",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}