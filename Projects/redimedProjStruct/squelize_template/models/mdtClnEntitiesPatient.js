module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnEntitiesPatient", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Patient_id': { 
    type: DataTypes.BIGINT(20),  
            },
            'Iscurrent': { 
    type: DataTypes.INTEGER(11),  
            },
            'Isenable': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'site_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "cln_entities_patients",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}