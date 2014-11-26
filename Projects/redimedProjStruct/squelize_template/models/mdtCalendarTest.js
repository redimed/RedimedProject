module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtCalendarTest", {
            'ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'PROVIDER': { 
    type: DataTypes.STRING(100),  
            },
            'START_DATE': { 
    type: DataTypes.DATE,  
            },
            'END_DATE': { 
    type: DataTypes.DATE,  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(200),  
            },
}, {
tableName: "calendar_test",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}