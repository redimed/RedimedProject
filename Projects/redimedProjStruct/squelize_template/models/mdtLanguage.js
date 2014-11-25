module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtLanguage", {
            'language_id': { 
    type: DataTypes.INTEGER(3),  
            primaryKey: true,
                    },
            'name': { 
    type: DataTypes.STRING(20),  
            },
            'last_update': { 
    type: DataTypes.DATE,  
                defaultValue: DataTypes.NOW,
        },
}, {
tableName: "language",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}