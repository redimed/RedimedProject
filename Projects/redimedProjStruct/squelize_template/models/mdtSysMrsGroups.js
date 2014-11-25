module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysMrsGroups", {
            'MRS_GROUP_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'MRS_DF_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'GROUP_NAME': { 
    type: DataTypes.STRING(200),  
            },
            'USER_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'ISENABLE': { 
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
tableName: "sys_mrs_groups",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}