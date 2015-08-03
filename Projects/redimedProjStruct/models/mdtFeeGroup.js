module.exports = function(sequelize, DataTypes){
	 var FeeGroup = sequelize.define('FeeGroup', {
		FEE_GROUP_ID: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		FEE_GROUP_NAME: DataTypes.STRING(100),
		FEE_GROUP_TYPE: DataTypes.STRING(50),
		FORMULA :DataTypes.STRING(200),
		PRICE_SOURCE:DataTypes.STRING(200),
		CONTACT_ADDRESS:DataTypes.STRING(200),
		ISENABLE: DataTypes.INTEGER(1),
		SOURCE_START_DATE:DataTypes.DATE,
		SOURCE_FILE_TYPE:DataTypes.STRING(10),
		COLUMN_MAPPING:DataTypes.STRING(300),
		CREATED_BY: DataTypes.INTEGER(11),
		LAST_UPDATED_BY: DataTypes.INTEGER(11),
	}, {
		tableName: 'cln_fee_group',
		createdAt: 'CREATION_DATE',
		updatedAt: 'LAST_UPDATE_DATE',
		classMethods: {
			associate: function(models) {
				FeeGroup.hasMany(models.FeeType, { as: 'FeeTypes', foreignKey: 'FEE_GROUP_ID' });
			},
			 
			getUploadPath: function(){ 
				return 'uploadFile/ItemFee/'; 
			}
        }
	});

	return FeeGroup;
}