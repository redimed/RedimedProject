module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFaAssetUsed", {
            'CompanyId': { 
    type: DataTypes.INTEGER(11),  
            },
            'SiteId': { 
    type: DataTypes.INTEGER(11),  
            },
            'AssetUsedID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'AssetID': { 
    type: DataTypes.INTEGER(11),  
            },
            'LineNo': { 
    type: DataTypes.INTEGER(11),  
            },
            'VoucherNo': { 
    type: DataTypes.STRING(200),  
            },
            'InvoiceNo': { 
    type: DataTypes.STRING(200),  
            },
            'TransactionDate': { 
    type: DataTypes.DATE,  
            },
            'usernames': { 
    type: DataTypes.STRING(200),  
            },
            'Notes': { 
    type: DataTypes.STRING(200),  
            },
            'DebitAccountID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CreditAccountID': { 
    type: DataTypes.INTEGER(11),  
            },
            'T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            }, {
tableName: "fa_asset_used",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}