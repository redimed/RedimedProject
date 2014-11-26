module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtUserdevicetoken", {
            'ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'userId': { 
    type: DataTypes.INTEGER(11),  
            },
            'deviceToken': { 
    type: DataTypes.STRING(500),  
            },
            'roomSession': { 
    type: DataTypes.STRING(500),  
            },
            'roomToken': { 
    type: DataTypes.STRING(500),  
            },
}, {
tableName: "userdevicetoken",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}