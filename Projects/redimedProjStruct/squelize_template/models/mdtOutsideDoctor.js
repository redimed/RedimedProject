module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOutsideDoctor", {
            'doctor_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'provider_no': { 
    type: DataTypes.STRING(100),  
            },
            'name': { 
    type: DataTypes.STRING(100),  
            },
            'address': { 
    type: DataTypes.STRING(200),  
            },
            'suburb': { 
    type: DataTypes.STRING(100),  
            },
            'state': { 
    type: DataTypes.STRING(100),  
            },
            'phone': { 
    type: DataTypes.STRING(20),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "outside_doctors",
createdAt: "creation_date",
updatedAt: "last_update_date",
});
return mdtInstance;
}