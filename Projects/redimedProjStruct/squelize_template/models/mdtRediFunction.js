module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtRediFunction", {
            'function_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'decription': { 
    type: DataTypes.STRING(60),  
            },
            'definition': { 
    type: DataTypes.STRING(200),  
            },
            'type': { 
    type: DataTypes.STRING(50),  
            },
            'isWeb': { 
    type: DataTypes.INTEGER(11),  
            },
            'isMobile': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "redi_functions",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}