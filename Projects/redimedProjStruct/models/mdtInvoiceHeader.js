module.exports = function(sequelize, DataTypes){
	 var mdtInvoiceHeader = sequelize.define('mdtInvoiceHeader', {
		header_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		cal_id: DataTypes.INTEGER(11),
		Patient_id: DataTypes.INTEGER(11),
		Company_id: DataTypes.INTEGER(11),
		Insurer_id: DataTypes.INTEGER(11),
		DOCTOR_ID: DataTypes.INTEGER(11),
		SITE_ID: DataTypes.INTEGER(11),
		DEPT_ID: DataTypes.INTEGER(11),
		SERVICE_ID: DataTypes.INTEGER(11),
		INVOICE_NUMBER: DataTypes.INTEGER(11),
		INVOICE_DATE: DataTypes.DATE,
		CURRENCY_CODE: DataTypes.STRING(45),
		RATE_TYPE: DataTypes.STRING(45),
		RATE: DataTypes.INTEGER(11),
		STATUS: DataTypes.STRING(45),
		DESCRIPTION: DataTypes.STRING(1000),
		DUE_DATE: DataTypes.DATE,
		AMOUNT: DataTypes.FLOAT,
		TAX_AMOUNT: DataTypes.FLOAT,
		TOTAL_AMOUNT: DataTypes.FLOAT,
		BASE_AMOUNT: DataTypes.FLOAT,
		BASE_TAX_AMOUNT: DataTypes.FLOAT,
		BASE_TOTAL_AMOUNT: DataTypes.FLOAT,
		LAST_UPDATED_BY: DataTypes.INTEGER(11),
		CREATED_BY: DataTypes.INTEGER(11),
	}, {
		tableName: 'cln_invoice_header',
		createdAt: 'CREATION_DATE',
		updatedAt: 'LAST_UPDATE_DATE',
		classMethods: {
            associate: function(models) {

            	mdtInvoiceHeader.hasMany(models.mdtInvoiceLine, { 
                	as: 'Lines', foreignKey: 'HEADER_ID'
                });

                mdtInvoiceHeader.belongsTo(models.Patient, { 
                	as: 'Patient', foreignKey: 'Patient_id'
                });

                mdtInvoiceHeader.belongsTo(models.Company, { 
                	as: 'Company', foreignKey: 'Company_id'
                });

                mdtInvoiceHeader.belongsTo(models.Insurer, { 
                	as: 'Insurer', foreignKey: 'Insurer_id'
                });

                mdtInvoiceHeader.belongsTo(models.mdtRedimedsites, { 
                	as: 'Site', foreignKey: 'SITE_ID'
                });

                mdtInvoiceHeader.belongsTo(models.Doctor, { 
                	as: 'Doctor', foreignKey: 'DOCTOR_ID'
                });

                mdtInvoiceHeader.belongsTo(models.SysServices, { 
                	as: 'Service', foreignKey: 'SERVICE_ID'
                });

                 mdtInvoiceHeader.belongsTo(models.Department, { 
                	as: 'Department', foreignKey: 'DEPT_ID'
                });

            }
        }
	});

	return mdtInvoiceHeader;
}