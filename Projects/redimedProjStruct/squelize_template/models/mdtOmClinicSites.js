module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmClinicSites", {
            'OM_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'SITE_NAME': { 
    type: DataTypes.STRING(200),  
            },
            'ADDRESS': { 
    type: DataTypes.STRING(200),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
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
tableName: "om_clinic_sites",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}