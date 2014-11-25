module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysSaDfHeaders", {
            'SA_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'SA_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'SA_CODE': { 
    type: DataTypes.STRING(10),  
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
            'report_type': { 
    type: DataTypes.STRING(20),  
            },
            'RECIPIENT_NAME': { 
    type: DataTypes.STRING(200),  
            },
            'LOCATION_ID': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_sa_df_headers",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}