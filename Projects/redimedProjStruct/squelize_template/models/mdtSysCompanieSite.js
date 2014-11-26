module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysCompanieSite", {
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CLIENT_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_NAME': { 
    type: DataTypes.STRING(100),  
            },
            'ADDR': { 
    type: DataTypes.STRING(100),  
            },
            'SUBURB': { 
    type: DataTypes.STRING(20),  
            },
            'POSTCODE': { 
    type: DataTypes.INTEGER(11),  
            },
            'STATE': { 
    type: DataTypes.STRING(20),  
            },
            'COUNTRY': { 
    type: DataTypes.STRING(20),  
            },
            'INV_COST_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'INV_COST_METHOD': { 
    type: DataTypes.STRING(10),  
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
                    'redimed_site_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_companie_sites",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}