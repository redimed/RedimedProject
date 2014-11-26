module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnItemHealthFundFee", {
            'ITEM_HEALTH_FUND_FEE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'CLN_ITEM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Private_fund_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'START_DATE': { 
    type: DataTypes.DATE,  
            },
            'AHSA_MEMBER': { 
    type: DataTypes.INTEGER(11),  
            },
            'FEE': { 
    type: DataTypes.FLOAT,  
            },
            'PERCENT_FEE': { 
    type: DataTypes.FLOAT,  
            },
            'FULLY_FEE': { 
    type: DataTypes.FLOAT,  
            },
            'FULLY_PERCENT_FEE': { 
    type: DataTypes.FLOAT,  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "cln_item_health_fund_fees",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}