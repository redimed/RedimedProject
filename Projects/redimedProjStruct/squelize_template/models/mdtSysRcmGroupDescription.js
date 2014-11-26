module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysRcmGroupDescription", {
            'RCM_GROUP_DES_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'RCM_GROUP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(500),  
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
tableName: "sys_rcm_group_descriptions",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}