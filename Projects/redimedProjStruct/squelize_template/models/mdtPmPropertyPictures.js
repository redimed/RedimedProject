module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPmPropertyPictures", {
            'pic_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'pic_name': { 
    type: DataTypes.STRING(100),  
            },
            'room_type_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'before_picture_path': { 
    type: DataTypes.TEXT,  
            },
            'after_picture_path': { 
    type: DataTypes.TEXT,  
            },
            'note': { 
    type: DataTypes.STRING(500),  
            },
            'process_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'property_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "pm_property_pictures",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}