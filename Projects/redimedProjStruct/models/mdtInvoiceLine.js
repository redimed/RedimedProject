module.exports = function(sequelize, DataTypes){
	 var mdtInvoiceLine = sequelize.define('mdtInvoiceLine', {
		line_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		HEADER_ID: DataTypes.INTEGER(11),
		ITEM_ID: DataTypes.INTEGER(11),
		appt_item_id: DataTypes.INTEGER(11),
		PRICE: DataTypes.FLOAT,
		QUANTITY: DataTypes.INTEGER(11),
		TIME_SPENT: DataTypes.INTEGER(11),
		DESCRIPTION: DataTypes.STRING(1000),
		AMOUNT: DataTypes.FLOAT,
		TAX_AMOUNT: DataTypes.FLOAT,
		BASE_AMOUNT: DataTypes.FLOAT,
		BASE_TAX_AMOUNT: DataTypes.FLOAT,
		IS_ENABLE: DataTypes.INTEGER(1),
		LAST_UPDATED_BY: DataTypes.INTEGER(11),
		CREATED_BY: DataTypes.INTEGER(11),
	}, {
		tableName: 'cln_invoice_lines',
		createdAt: 'CREATION_DATE',
		updatedAt: 'LAST_UPDATE_DATE',
		classMethods: {
            associate: function(models) {

            	mdtInvoiceLine.belongsTo(models.InvItem, { 
                	as: 'InvItem', foreignKey: 'ITEM_ID'
                });
            }
        }
	});

	return mdtInvoiceLine;
}