module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrAsset", {
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
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
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