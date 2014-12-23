module.exports = function(sequelize, DataTypes){
    var mdtInstance = sequelize.define("OutsideReferral", {
            'id': { 
                type: DataTypes.INTEGER(11),  
                primaryKey: true,
                autoIncrement: true,           
             },
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
            'creation_date': {
                type: DataTypes.DATE,
            },
            'last_update_date': {
                type: DataTypes.DATE
            }
        }, {
            tableName: "outside_referrals",
            timestamps: false,
            classMethods: {
                associate: function(models) {
                    mdtInstance.belongsTo(models.Patient, { as: 'Patient', foreignKey: 'patient_id'});
                }
            }

        });
    return mdtInstance;
}