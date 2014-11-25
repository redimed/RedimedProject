module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmClinicSite", {
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
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "om_clinic_sites",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}