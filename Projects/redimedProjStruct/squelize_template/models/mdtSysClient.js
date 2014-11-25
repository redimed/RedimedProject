module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysClient", {
            'CLIENT_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'CLIENT_NAME': { 
    type: DataTypes.STRING(100),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "sys_clients",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}