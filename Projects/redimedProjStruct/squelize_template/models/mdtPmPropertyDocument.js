module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPmPropertyDocument", {
            'doc_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'doc_name': { 
    type: DataTypes.STRING(100),  
            },
            'doc_path': { 
    type: DataTypes.STRING(500),  
            },
            'process_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'property_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'cost_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "pm_property_documents",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}