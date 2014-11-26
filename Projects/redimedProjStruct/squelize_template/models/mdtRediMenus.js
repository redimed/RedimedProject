module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtRediMenus", {
            'menu_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'description': { 
    type: DataTypes.STRING(60),  
            },
            'definition': { 
    type: DataTypes.STRING(200),  
            },
            'parent_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'type': { 
    type: DataTypes.STRING(50),  
            },
            'seq': { 
    type: DataTypes.INTEGER(11),  
            },
            'is_mutiple_instance': { 
    type: DataTypes.INTEGER(11),  
            },
            'function_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'isEnable': { 
    type: DataTypes.INTEGER(11),  
            },
            'isWeb': { 
    type: DataTypes.INTEGER(11),  
            },
            'isMobile': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "redi_menus",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}