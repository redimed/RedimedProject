module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysEntitySite", {
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_NAME': { 
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
            'ADDRESS': { 
    type: DataTypes.STRING(100),  
            },
            'SUBURB': { 
    type: DataTypes.STRING(20),  
            },
            'STATE': { 
    type: DataTypes.STRING(20),  
            },
            'COUNTRY': { 
    type: DataTypes.STRING(20),  
            },
            'POSTCODE': { 
    type: DataTypes.INTEGER(11),  
            },
            'PHONE1': { 
    type: DataTypes.STRING(20),  
            },
            'PHONE2': { 
    type: DataTypes.STRING(20),  
            },
            'PHONE3': { 
    type: DataTypes.STRING(20),  
            },
            'FAX': { 
    type: DataTypes.STRING(20),  
            },
            'EMAIL': { 
    type: DataTypes.STRING(50),  
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
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "sys_entity_sites",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}