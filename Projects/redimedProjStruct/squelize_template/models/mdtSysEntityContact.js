module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysEntityContact", {
            'CONTACT_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PREFIX': { 
    type: DataTypes.STRING(10),  
            },
            'FIRST_NAME': { 
    type: DataTypes.STRING(20),  
            },
            'LAST_NAME': { 
    type: DataTypes.STRING(20),  
            },
            'BIRTHDAY': { 
    type: DataTypes.DATE,  
            },
            'DEPT': { 
    type: DataTypes.STRING(30),  
            },
            'POSITION': { 
    type: DataTypes.STRING(30),  
            },
            'PHONE': { 
    type: DataTypes.STRING(20),  
            },
            'MOBILE': { 
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
tableName: "sys_entity_contacts",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}