module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFaAssetCapitals", {
            'CompanyId': { 
    type: DataTypes.INTEGER(11),  
            },
            'SiteId': { 
    type: DataTypes.INTEGER(11),  
            },
            'TransactionId': { 
    type: DataTypes.INTEGER(11),  
            },
            'AssetCapitalID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'AssetID': { 
    type: DataTypes.INTEGER(11),  
            },
            'LineID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CapitalCode': { 
    type: DataTypes.INTEGER(11),  
            },
            'Amount': { 
    type: DataTypes.FLOAT,  
            },
            'DepreciationAmount': { 
    type: DataTypes.FLOAT,  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "fa_asset_capital",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}