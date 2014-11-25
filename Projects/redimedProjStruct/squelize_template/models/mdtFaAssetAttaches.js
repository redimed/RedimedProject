module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFaAssetAttaches", {
            'CompanyId': { 
    type: DataTypes.INTEGER(11),  
            },
            'SiteId': { 
    type: DataTypes.INTEGER(11),  
            },
            'AssetAttachID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'AssetID': { 
    type: DataTypes.INTEGER(11),  
            },
            'LineNo': { 
    type: DataTypes.INTEGER(11),  
            },
            'Interpretation': { 
    type: DataTypes.STRING(200),  
            },
            'Quantity': { 
    type: DataTypes.DECIMAL(),  
            },
            'Unit': { 
    type: DataTypes.STRING(200),  
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
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "fa_asset_attach",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}