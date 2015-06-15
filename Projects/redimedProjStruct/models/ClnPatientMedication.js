module.exports = function(sequelize,DataTypes){
	var ClnPatientMedication = sequelize.define('ClnPatientMedication',{
	   id : {type: DataTypes.INTEGER(11), primaryKey: true },
	   patient_id : DataTypes.INTEGER(11) ,
	   consult_id : DataTypes.INTEGER(11) ,
	   medication_name: DataTypes.STRING(200) ,
	   strength: DataTypes.STRING(200),
	   form: DataTypes.STRING(200),
	   qty: DataTypes.INTEGER(11),
	   price: DataTypes.FLOAT,
	   code: DataTypes.STRING(100),
	   script: DataTypes.TEXT,
	   dose: DataTypes.STRING(200),
	   frequency: DataTypes.STRING(200),
	   instructions: DataTypes.TEXT,
	   repeat: DataTypes.STRING(200),
	   reason: DataTypes.TEXT,
	   category: DataTypes.STRING(200),
	   Created_by : DataTypes.INTEGER(11) ,
	   Creation_date : DataTypes.DATE ,
	   Last_updated_by : DataTypes.INTEGER(11) ,
	   Last_update_date : DataTypes.DATE,
	   unit: DataTypes.STRING(200),
	   route: DataTypes.STRING(200),
	   start_date: DataTypes.DATE,
	   end_date: DataTypes.DATE,
	   doctor_id: DataTypes.INTEGER(11),
	   condition_Indication: DataTypes.STRING(200)
},{
	 tableName: 'cln_patient_medication_details', // đặt tên bảng
	  createdAt: 'Creation_date',
      updatedAt: 'Last_update_date'
    });

    return ClnPatientMedication;
};