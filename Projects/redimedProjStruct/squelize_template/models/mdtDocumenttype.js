module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtDocumenttype", {
            'TypeValue': { 
    type: DataTypes.STRING(10),  
            primaryKey: true,
                    },
            'TypeName': { 
    type: DataTypes.STRING(200),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "documenttype",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}