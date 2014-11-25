module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysOrganization", {
            'ORG_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'CLIENT_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORG_CODE': { 
    type: DataTypes.STRING(10),  
            },
            'ORG_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'MATERIAL_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'T10': { 
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
tableName: "sys_organizations",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}