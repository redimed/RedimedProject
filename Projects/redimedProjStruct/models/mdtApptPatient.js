module.exports = function(sequelize, DataTypes){
    var mdtInstance = sequelize.define("ApptPatient", {
      "id" : {type:DataTypes.INTEGER(11), primaryKey: true} ,
      "Patient_id" : DataTypes.INTEGER(11),
      "CAL_ID" : DataTypes.INTEGER(11),
      "appt_status" : DataTypes.STRING(20),
      "Created_by" : DataTypes.INTEGER(11),
      "Creation_date" : DataTypes.DATE,
      "Last_update_date" : DataTypes.DATE,
      "isEnable" : DataTypes.INTEGER(11),
      "SESSION_START_TIME" : DataTypes.DATE,
      "SESSION_END_TIME" : DataTypes.DATE,
      "checkedin_start_time" : DataTypes.DATE,
      "checkedin_end_time" : DataTypes.DATE,
      "actual_doctor_id" : DataTypes.INTEGER(11),
      "room_id" : DataTypes.INTEGER(11),
      "injury_id" : DataTypes.INTEGER(11),
      "isPickUp" : DataTypes.INTEGER(11)
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