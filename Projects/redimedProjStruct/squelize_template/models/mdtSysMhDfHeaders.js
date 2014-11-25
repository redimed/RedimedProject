module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysMhDfHeaders", {
            'MH_DF_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'DF_CODE': { 
    type: DataTypes.STRING(10),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
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
}, {
tableName: "sys_mh_df_headers",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}