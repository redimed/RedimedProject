module.exports = function (sequelize, DataTypes) {
    var mdtInstance = sequelize.define("InvItem", {
        'ITEM_ID': {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true, 
        },
        'ITEM_NAME': {
            type: DataTypes.STRING(5000),
        },
        'ALT_NAME': {
            type: DataTypes.STRING(100),
        },
        'DESCRIPTION': {
            type: DataTypes.STRING(5000),
        },
        'UOM': {
            type: DataTypes.STRING(10),
        },
        'ITEM_TYPE': {
            type: DataTypes.STRING(20),
        },
        'TAX_ID': {
            type: DataTypes.INTEGER(11),
        },
        'ISINV': {
            type: DataTypes.INTEGER(11),
        },
        'ISASSET': {
            type: DataTypes.INTEGER(11),
        },
        'ISBOM': {
            type: DataTypes.INTEGER(11),
        },
        'LOT_OR_SERIAL': {
            type: DataTypes.STRING(10),
        },
        'ISEXP': {
            type: DataTypes.INTEGER(11),
        },
        'PRICE': {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        'ISENABLE': {
            type: DataTypes.INTEGER(11),
        },
        'CREATED_BY': {
            type: DataTypes.INTEGER(11),
        },
        'Last_updated_by': {
            type: DataTypes.INTEGER(11),
        },
        'Prefix': {
            type: DataTypes.STRING(80),
        },
        'ITEM_START_DATE': {
            type: DataTypes.DATE,
        },
        'ITEM_END_DATE': {
            type: DataTypes.DATE,
        },
        'CATEGORY': {
            type: DataTypes.STRING(3),
        },
        'INV_GROUP': {
            type: DataTypes.STRING(3),
        },
        'SUB_GROUP': {
            type: DataTypes.STRING(3),
        },
        'SUB_HEADING': {
            type: DataTypes.STRING(3),
        },
        'FEE_TYPE': {
            type: DataTypes.STRING(1),
        },
        'PROVIDER_TYPE': {
            type: DataTypes.STRING(3),
        },
        'NEW_ITEM': {
            type: DataTypes.STRING(1),
        },
        'ITEM_CHANGE': {
            type: DataTypes.STRING(1),
        },
        'ANAES_CHANGE': {
            type: DataTypes.STRING(1),
        },
        'DESCRIPTOR_CHANGE': {
            type: DataTypes.STRING(1),
        },
        'FEE_CHANGE': {
            type: DataTypes.STRING(1),
        },
        'EMSN_CHANGE': {
            type: DataTypes.STRING(1),
        },
        'EMSN_CAP': {
            type: DataTypes.STRING(1),
        },
        'BENEFIT_TYPE': {
            type: DataTypes.STRING(1),
        },
        'BENEFIT_START_DATE': {
            type: DataTypes.DATE,
        },
        'EMSN_START_DATE': {
            type: DataTypes.DATE,
        },
        'EMSN_END_DATE': {
            type: DataTypes.DATE,
        },
        'EMSN_FIXED_CAP_AMOUNT': {
            type: DataTypes.FLOAT,
        },
        'EMSN_PERCENTAGE_CAP': {
            type: DataTypes.FLOAT,
        },
        'EMSN_MAXIMUM_CAP': {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        'EMSN_DESCRIPTION': {
            type: DataTypes.STRING(5000),
        },
        'EMSN_CHANGE_DATE': {
            type: DataTypes.DATE,
        },
        'DERIVED_FEE_START_DATE': {
            type: DataTypes.DATE,
        },
        'DERIVED_FEE': {
            type: DataTypes.STRING(5000),
        },
        'ANAES': {
            type: DataTypes.STRING(1),
        },
        'DESCRIPTION_START_DATE': {
            type: DataTypes.DATE,
        },
        'QFE_START_DATE': {
            type: DataTypes.DATE,
        },
        'QFE_END_DATE': {
            type: DataTypes.DATE,
        },
        'ITEM_CODE': {
            type: DataTypes.STRING(20),
        },
        'SUB_ITEM_CODE': {
            type: DataTypes.STRING(20),
        },
        'DURING_TIME': {
            type: DataTypes.INTEGER(11),
        },
        'AMA_CODE': {
            type: DataTypes.STRING(20),
        },
        'AMA_DESC': {
            type: DataTypes.TEXT,
        },
        'isPO': {
            type: DataTypes.INTEGER(11),
        },
        'isOM': {
            type: DataTypes.INTEGER(11),
        },
    }, {
        tableName: "inv_items",
        createdAt: "CREATION_DATE",
        updatedAt: "Last_update_date",
        classMethods: {
            associate: function (models) {
                mdtInstance.hasMany(models.Appointment, {
                    as: 'Appointments',
                    foreignKey: 'CLN_ITEM_ID',
                    through: models.ApptItems
                });

                mdtInstance.hasMany(models.InvItemHeader, {
                    as: 'Headers',
                    foreignKey: 'ITEM_ID',
                    through: models.InvItemLine
                });

                mdtInstance.hasMany(models.FeeType, {
                    as: 'FeeTypes',
                    foreignKey: 'CLN_ITEM_ID',
                    through: models.mdtClnItemFee
                });

                mdtInstance.hasMany(models.PrivateFund, {
                    as: 'PrivateFunds',
                    foreignKey: 'CLN_ITEM_ID',
                    through: models.mdtClnItemHealthFundFee
                });
            }
        }
    });
    return mdtInstance;
}