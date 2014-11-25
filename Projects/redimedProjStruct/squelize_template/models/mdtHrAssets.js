module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrAssets", {
            'asset_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'asset_code': { 
    type: DataTypes.STRING(200),  
            },
            'asset_name': { 
    type: DataTypes.STRING(200),  
            },
            'purchase_date': { 
    type: DataTypes.DATE,  
            },
            'status': { 
    type: DataTypes.INTEGER(11),  
            },
            'note': { 
    type: DataTypes.STRING(200),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
            'asset_group_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_asset",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}