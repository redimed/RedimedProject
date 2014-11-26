module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtThTelehealthPicture", {
            'ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'TelehealthID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PICTURE': { 
    type: DataTypes.BLOB,  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "th_telehealth_pictures",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}