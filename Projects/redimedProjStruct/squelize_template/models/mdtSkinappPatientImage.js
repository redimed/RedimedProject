module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSkinappPatientImage", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'data': { 
    type: DataTypes.TEXT,  
            },
            'info': { 
    type: DataTypes.TEXT,  
            },
            'created': { 
    type: DataTypes.DATE,  
            },
            'updated': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "skinapp_patient_images",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}