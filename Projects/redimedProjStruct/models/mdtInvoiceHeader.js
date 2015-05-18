module.exports = function(sequelize, DataTypes){
	 var mdtInvoiceHeader = sequelize.define('mdtInvoiceHeader', {
		header_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		cal_id: DataTypes.INTEGER(11),
		claim_id: DataTypes.INTEGER(11),
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
		hooks: {
			beforeUpdate: function( header, fn ) {
				if(header.claim_id) {
					header.getClaim().success(function(claim){
						if(!claim) {
							fn();
							return;
						}

						header.set('Insurer_id', claim.insurer_site);
						fn();
					}).error(function(err){
						console.log(err)
						fn();
					})
				} else {
					fn();
				}
			},
			afterUpdate: function( header, fn ) {
				if(!header.cal_id) {
					fn();
					return;
				}
				
				var updateData = {Claim_id : header.claim_id};
				var PatientClaim = sequelize.daoFactoryManager.getDAO('mdtPatientClaim', { attribute: 'name' })
				PatientClaim.findOrCreate(
					{Patient_id: header.Patient_id, CAL_ID: header.cal_id}, 
					updateData
				).success(function(pclaim, created){
					if(created) {
						fn();
						return;
					}
					return pclaim.updateAttributes(updateData)
				})
				.then(function(){
					fn();
				})
				.error(function(err){
					console.log(err)
					fn(err);
				})
			}
	    },
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

                mdtInvoiceHeader.belongsTo(models.Claim, { 
                	as: 'Claim', foreignKey: 'claim_id'
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
                 mdtInvoiceHeader.belongsTo(models.Appointment,{
                 	as: 'Appointment', foreignKey: 'cal_id'
                 });
            },
            
        },
        instanceMethods: {
		 	getAmount : function() {
		 		var lines = this.lines.filter(function(item){
		 			return item.IS_ENABLE == 1;
		 		});	

		 		var amount = 0;
				for(var i = 0, len = lines.length; i < len; ++i) {
		 			var line = lines[i];
		 			amount +=  line.AMOUNT;
		 		}
		 		return amount;
            }
		}
	});

	return mdtInvoiceHeader;
}