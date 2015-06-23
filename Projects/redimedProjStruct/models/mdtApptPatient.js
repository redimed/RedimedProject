module.exports = function(sequelize, DataTypes){
    var mdtInstance = sequelize.define("ApptPatient", {
        'id': { 
            type: DataTypes.INTEGER(11),  
            primaryKey: true,
            autoIncrement: true,           
        },

        'Patient_id': { 
            type: DataTypes.INTEGER(11),  
        },
        'CAL_ID': { 
            type: DataTypes.INTEGER(11),  
        },
        'appt_status': {
            type:DataTypes.STRING(20)
        },
        'checkedin_start_time': {
            type:DataTypes.DATE
        },
        'actual_doctor_id': {
            type:DataTypes.INTEGER(11)
        },
        'injury_id': {
            type:DataTypes.INTEGER(11)
        },
        
    }, {
        tableName: "cln_appt_patients",
        createdAt: "Creation_date",
        updatedAt: "Last_update_date",
        classMethods: {
            associate: function(models){
                mdtInstance.belongsTo(models.Appointment,{
                    as: 'Appointment', foreignKey: 'CAL_ID'
                });
                mdtInstance.belongsTo( models.Patient, { 
                    as: 'Patient', foreignKey: 'Patient_id'
                });
            }
        }// end association
    });
return mdtInstance;
}