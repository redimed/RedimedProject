module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysEntityBank", {
            'BANK_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'BANK_NAME': { 
    type: DataTypes.STRING(100),  
            },
            'BSB': { 
    type: DataTypes.STRING(10),  
            },
            'ACC_NO': { 
    type: DataTypes.STRING(10),  
            },
            'SWIFT_CODE': { 
    type: DataTypes.STRING(10),  
            },
            'CURR': { 
    type: DataTypes.STRING(10),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISPRIMARY': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "sys_entity_banks",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}