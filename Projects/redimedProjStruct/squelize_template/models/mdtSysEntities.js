module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysEntities", {
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'EMP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'ENTITY_NAME': { 
    type: DataTypes.STRING(100),  
            },
            'ALT_NAME': { 
    type: DataTypes.STRING(100),  
            },
            'TAX_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISINTERNAL': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_TYPE': { 
    type: DataTypes.STRING(10),  
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
tableName: "sys_entities",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}