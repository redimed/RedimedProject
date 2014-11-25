module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSkinapppictures", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'skin_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'body_part': { 
    type: DataTypes.STRING(100),  
            },
            'picture': { 
    type: DataTypes.BLOB,  
            },
            'isFront': { 
    type: DataTypes.INTEGER(1),  
            },
}, {
tableName: "skinapppicture",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}