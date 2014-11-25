module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtRediUserMenus", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'menu_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'user_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'isEnable': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "redi_user_menus",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}