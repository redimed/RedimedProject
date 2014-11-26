module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnProviderType", {
            'Provider_types_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Provider_types_name': { 
    type: DataTypes.STRING(50),  
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
        }, {
tableName: "cln_provider_types",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}