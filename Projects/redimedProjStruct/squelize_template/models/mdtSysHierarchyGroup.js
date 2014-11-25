module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysHierarchyGroup", {
            'GROUP_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'GROUP_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'DECRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'GROUP_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
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
tableName: "sys_hierarchy_group",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}