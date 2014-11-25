module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPkKeys", {
            'TABLE_NAME': { 
    type: DataTypes.STRING(50),  
            primaryKey: true,
                        defaultValue: ,
        },
            'TABLE_VALUE': { 
    type: DataTypes.BIGINT(20),  
            },
}, {
tableName: "pk_keys",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}