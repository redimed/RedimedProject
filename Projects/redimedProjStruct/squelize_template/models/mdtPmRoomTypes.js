module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPmRoomTypes", {
            'room_type_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'room_type_name': { 
    type: DataTypes.STRING(100),  
            },
            'isEnable': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "pm_room_types",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}