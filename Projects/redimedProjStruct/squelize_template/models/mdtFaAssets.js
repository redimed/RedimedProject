module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFaAssets", {
            'companyId': { 
    type: DataTypes.INTEGER(11),  
            },
            'site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'asset_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'asset_code': { 
    type: DataTypes.STRING(100),  
            },
            'asset_name': { 
    type: DataTypes.STRING(100),  
            },
            'is_new': { 
    type: DataTypes.INTEGER(11),  
            },
            'tech_info': { 
    type: DataTypes.STRING(250),  
            },
            'manufacturer': { 
    type: DataTypes.STRING(100),  
            },
            'manufacture_date': { 
    type: DataTypes.DATE,  
            },
            'manufacture_nation': { 
    type: DataTypes.STRING(100),  
            },
            'entity_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'entity_site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price': { 
    type: DataTypes.DECIMAL(),  
            },
            'years_deprect_number': { 
    type: DataTypes.INTEGER(11),  
            },
            'months_deprect_number': { 
    type: DataTypes.INTEGER(11),  
            },
            'progress_loss': { 
    type: DataTypes.DECIMAL(),  
            },
            'deprect_number': { 
    type: DataTypes.INTEGER(11),  
            },
            'recovery_value': { 
    type: DataTypes.DECIMAL(),  
            },
            'usernames': { 
    type: DataTypes.STRING(200),  
            },
            'deprect_date': { 
    type: DataTypes.DATE,  
            },
            'asset_status': { 
    type: DataTypes.INTEGER(11),  
            },
            'remain_value': { 
    type: DataTypes.DECIMAL(),  
            },
            'original_price_cur': { 
    type: DataTypes.DECIMAL(),  
            },
            'UsedLineNo': { 
    type: DataTypes.INTEGER(11),  
            },
            'OriginalLineNo': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_amount': { 
    type: DataTypes.DECIMAL(),  
            },
            'deprect_number_cur': { 
    type: DataTypes.INTEGER(11),  
            },
            'is_censorship': { 
    type: DataTypes.INTEGER(11),  
            },
            'insert_date_voucher': { 
    type: DataTypes.DATE,  
            },
            'provider_code': { 
    type: DataTypes.INTEGER(11),  
            },
            'unit_delivery_code': { 
    type: DataTypes.INTEGER(11),  
            },
            'voucher_number': { 
    type: DataTypes.STRING(200),  
            },
            'bill_number': { 
    type: DataTypes.STRING(200),  
            },
            'note': { 
    type: DataTypes.STRING(250),  
            },
            'category_asset_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_price_account_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'deprect_cost_account_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'reciprocal_account_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'loss_account_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'appraise_account_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'revenue_account_T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'other_cost_account_T10': { 
    type: DataTypes.INTEGER(11),  
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
}, {
tableName: "fa_asset",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}