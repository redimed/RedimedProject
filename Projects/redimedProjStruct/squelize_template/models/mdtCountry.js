module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtCountry", {
            'country_id': { 
    type: DataTypes.INTEGER(5),  
            primaryKey: true,
                    },
            'country': { 
    type: DataTypes.STRING(50),  
            },
            'last_update': { 
    type: DataTypes.DATE,  
                defaultValue: DataTypes.NOW,
        },
}, {
tableName: "country",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}