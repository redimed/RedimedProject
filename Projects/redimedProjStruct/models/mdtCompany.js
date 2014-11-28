module.exports = function(sequelize, DataTypes){
	var mdtCompany = sequelize.define("mdtCompany", {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		Company_name: DataTypes.STRING(100),
		Industry: DataTypes.STRING(50),
		Addr: DataTypes.STRING(100),
		postcode: DataTypes.INTEGER(11),
		State: DataTypes.STRING(25),
		Description: DataTypes.STRING(250),
		latitute: DataTypes.FLOAT,
		longtitude: DataTypes.FLOAT,
		country: DataTypes.STRING(45),
		result_email: DataTypes.STRING(100),
		invoice_email: DataTypes.STRING(100),
		PO_number: DataTypes.STRING(50),
		isProject: DataTypes.INTEGER(4),
		isCalendar: DataTypes.INTEGER(4),
		father_id: DataTypes.INTEGER(11),
		report_to_email: DataTypes.STRING(50),
		default_status: DataTypes.STRING(20),
		isInvoiceEmailToUser: DataTypes.INTEGER(11),
		Created_by: DataTypes.INTEGER(11),
		Last_updated_by: DataTypes.INTEGER(11),
		isAddContactEmailToResult: DataTypes.INTEGER(11),
		IMA: DataTypes.STRING(50),
		Site_name: DataTypes.STRING(100),
		Medic_contact_no: DataTypes.STRING(15),
		Email: DataTypes.STRING(100),
		CODE: DataTypes.STRING(50),
		Insurer: DataTypes.INTEGER(11),
		Phone: DataTypes.STRING(15),
		Site_medic: DataTypes.STRING(100),
		User_id: DataTypes.INTEGER(11),
		isPO: DataTypes.INTEGER(11)
	}, {
		tableName: "companies",
		createdAt: "Creation_date",
		updatedAt: "Last_update_date"
	});

	return mdtCompany;
}