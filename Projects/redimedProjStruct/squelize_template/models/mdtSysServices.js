module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysServices", {
            'SERVICE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'SERVICE_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(250),  
            },
            'Isenable': { 
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
tableName: "sys_services",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}