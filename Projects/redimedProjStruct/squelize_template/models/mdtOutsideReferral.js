module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOutsideReferral", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'date_issued': { 
    type: DataTypes.DATE,  
            },
            'date_started': { 
    type: DataTypes.DATE,  
            },
            'duration': { 
    type: DataTypes.INTEGER(11),  
            },
            'expire_date': { 
    type: DataTypes.DATE,  
            },
            'referred_to_doctor': { 
    type: DataTypes.INTEGER(11),  
            },
            'doctor_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'patient_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "outside_referrals",
createdAt: "creation_date",
updatedAt: "last_update_date",
});
return mdtInstance;
}