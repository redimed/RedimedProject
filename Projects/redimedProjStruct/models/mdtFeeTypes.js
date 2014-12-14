module.exports = function(sequelize, DataTypes){
	 var FeeType = sequelize.define('FeeType', {
		FEE_TYPE_ID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		FEE_TYPE_NAME: DataTypes.STRING(11),
		PRICE_SOURCE: DataTypes.STRING(200),
		FEE_GROUP_ID: DataTypes.INTEGER(11),
		FEE_GROUP_ORDER: DataTypes.INTEGER(11),
		ISENABLE: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Created_by: DataTypes.INTEGER(11),
		Last_update_date: DataTypes.DATE,
		Last_updated_by: DataTypes.INTEGER(11),
	}, {
		tableName: 'cln_fee_types',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date',
        classMethods: {
            associate: function (models) {
                FeeType.hasMany(models.InvItem, {
                    as: 'Items', 
                    foreignKey: 'FEE_TYPE_ID',
                    through: models.mdtClnItemFee
                });
                FeeType.belongsTo(models.FeeGroup, { as: 'FeeGroup', foreignKey: 'FEE_GROUP_ID'});
            },
			getUploadPath: function(){ return 'uploadFile/ItemFee/'; }
        }
	});

	return FeeType;
}