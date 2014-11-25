module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysIdasHeader", {
            'IDAS_DF_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'DF_CODE': { 
    type: DataTypes.STRING(10),  
            },
            'ITEM_ID': { 
    type: DataTypes.STRING(10),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(250),  
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
tableName: "sys_idas_headers",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}