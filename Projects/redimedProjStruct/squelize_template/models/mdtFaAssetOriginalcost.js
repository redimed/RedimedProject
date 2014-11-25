module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFaAssetOriginalcost", {
            'CompanyId': { 
    type: DataTypes.INTEGER(11),  
            },
            'SiteId': { 
    type: DataTypes.INTEGER(11),  
            },
            'AssetID': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'Lineno': { 
    type: DataTypes.INTEGER(11),  
            },
            'TransactionDate': { 
    type: DataTypes.DATE,  
            },
            'BaseAmount': { 
    type: DataTypes.DECIMAL(),  
            },
            'DepreciationNumber': { 
    type: DataTypes.INTEGER(11),  
            },
            'TransactionID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Notes': { 
    type: DataTypes.STRING(200),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            }, {
tableName: "fa_asset_originalcost",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}