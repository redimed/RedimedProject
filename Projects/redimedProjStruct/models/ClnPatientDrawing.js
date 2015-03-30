module.exports = function(sequelize,DataTypes){
	var ClnPatientDrawing = sequelize.define('ClnPatientDrawing',{
	  id : {type: DataTypes.INTEGER(11), primaryKey: true },
	  consult_id: DataTypes.INTEGER(11) ,
	  patient_id : DataTypes.INTEGER(11) ,
	  notes: DataTypes.TEXT,
	  url: DataTypes.TEXT
},{
	 tableName: 'cln_patient_drawings', // đặt tên bảng
	  timestamps: false
    });

    return ClnPatientDrawing;
};