module.exports = function(sequelize, DataTypes){
	 var AppointmentDocument = sequelize.define('AppointmentDocument', {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		patient_id: DataTypes.INTEGER(11),
		cal_id: DataTypes.INTEGER(11),
		document_path: DataTypes.STRING(200),
		document_name: DataTypes.STRING(100),
		server_name: DataTypes.STRING(100),
		Created_by: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'cln_appt_document',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date',
        classMethods: {
			associate: function(models){
				AppointmentDocument.belongsTo(models.Appointment,{
                 as: 'Appointment', foreignKey: 'cal_id'
                });
			},

			getUploadPath: function(patient_id, cal_id){ 
				return 'uploadFile/AppointmentDocument/' + patient_id + '/' + cal_id + '/'; 
			}, 

			getFileName: function(){

			}

		}// end association
	});

	return AppointmentDocument;
};