module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysHierarchyNode", {
            'NODE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'NODE_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'FROM_VALUE': { 
    type: DataTypes.FLOAT,  
            },
            'TO_VALUE': { 
    type: DataTypes.FLOAT,  
            },
            'ISVALUE': { 
    type: DataTypes.INTEGER(11),  
            },
            'TO_NODE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'GROUP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'DECRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'GROUP_TYPE': { 
    type: DataTypes.STRING(20),  
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
                    'seq': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_hierarchy_nodes",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}