module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFaDepreciations", {
            'CompanyId': { 
    type: DataTypes.INTEGER(11),  
            },
            'SiteId': { 
    type: DataTypes.INTEGER(11),  
            },
            'AssetDepreciationID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'AssetID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Month': { 
    type: DataTypes.INTEGER(11),  
            },
            'Year': { 
    type: DataTypes.INTEGER(11),  
            },
            'BaseAmount': { 
    type: DataTypes.DECIMAL(),  
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
tableName: "fa_depreciation",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}