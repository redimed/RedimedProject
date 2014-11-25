module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFaAssetgroup", {
            'AssetGroupID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'AssetGroupCode': { 
    type: DataTypes.STRING(200),  
            },
            'AssetGroupName': { 
    type: DataTypes.STRING(200),  
            },
            'original_price_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                        'Segment01': { 
    type: DataTypes.INTEGER(11),  
            },
            'Segment02': { 
    type: DataTypes.INTEGER(11),  
            },
            'Segment03': { 
    type: DataTypes.INTEGER(11),  
            },
            'Segment04': { 
    type: DataTypes.INTEGER(11),  
            },
            'Segment05': { 
    type: DataTypes.INTEGER(11),  
            },
            'Segment06': { 
    type: DataTypes.INTEGER(11),  
            },
            'Segment07': { 
    type: DataTypes.INTEGER(11),  
            },
            'Segment08': { 
    type: DataTypes.INTEGER(11),  
            },
            'Segment09': { 
    type: DataTypes.INTEGER(11),  
            },
            'Segment10': { 
    type: DataTypes.INTEGER(11),  
            },
            'CompanyId': { 
    type: DataTypes.INTEGER(11),  
            },
            'SiteId': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "fa_assetgroup",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}