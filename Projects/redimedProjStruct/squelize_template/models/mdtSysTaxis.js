module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysTaxis", {
            'TAX_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'TAX_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'TAX_NAME': { 
    type: DataTypes.STRING(100),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'TAX_RATE': { 
    type: DataTypes.FLOAT,  
            },
            'TAX_RETURN_RATE': { 
    type: DataTypes.FLOAT,  
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
                    'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_taxes",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}