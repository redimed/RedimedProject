module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysUserNotifications", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'user_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'ref_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'source_name': { 
    type: DataTypes.STRING(20),  
            },
            'msg': { 
    type: DataTypes.STRING(200),  
            },
            'STATUS': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: 0,
        },
            'time_created': { 
    type: DataTypes.DATE,  
                defaultValue: DataTypes.NOW,
        },
            'TYPE': { 
    type: DataTypes.STRING(20),  
            },
}, {
tableName: "sys_user_notifications",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}