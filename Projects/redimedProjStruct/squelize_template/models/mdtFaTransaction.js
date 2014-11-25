module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFaTransaction", {
            'CompanyId': { 
    type: DataTypes.INTEGER(11),  
            },
            'SiteId': { 
    type: DataTypes.INTEGER(11),  
            },
            'AssetID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TransactionID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'TransactionDate': { 
    type: DataTypes.DATE,  
            },
            'TransactionType': { 
    type: DataTypes.INTEGER(11),  
            },
            'AmountDP': { 
    type: DataTypes.DECIMAL(),  
            },
            'DepreciationNumberDP': { 
    type: DataTypes.DECIMAL(),  
            },
            'ACCCD': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACCCD2': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACCCD3': { 
    type: DataTypes.INTEGER(11),  
            },
            'Code': { 
    type: DataTypes.STRING(1),  
            },
            'VoucherNo': { 
    type: DataTypes.STRING(200),  
            },
            'InvoiceNo': { 
    type: DataTypes.STRING(200),  
            },
            'DeptId': { 
    type: DataTypes.INTEGER(11),  
            },
            'Notes': { 
    type: DataTypes.STRING(150),  
            },
            'Amount': { 
    type: DataTypes.DECIMAL(),  
            },
            'DepreciationNumber': { 
    type: DataTypes.DECIMAL(),  
            },
            'DebitAcccd': { 
    type: DataTypes.INTEGER(11),  
            },
            'CreditAcccd': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            }, {
tableName: "fa_transactions",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}