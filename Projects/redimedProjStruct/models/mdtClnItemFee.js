module.exports = function(sequelize, DataTypes){
    var mdtInstance = sequelize.define("mdtClnItemFee", {
        'ITEM_FEE_ID': { 
            type: DataTypes.INTEGER(11),  
            primaryKey: true,
        },
        'FEE_TYPE_ID': { 
            type: DataTypes.INTEGER(11),  
        },
        'CLN_ITEM_ID': { 
            type: DataTypes.INTEGER(11),  
        },
        'FEE_START_DATE': { 
            type: DataTypes.DATE,  
        },
        'SCHEDULE_FEE': { 
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
        tableName: "cln_item_fees",
        createdAt: "CREATION_DATE",
        updatedAt: "Last_update_date",
    });
return mdtInstance;
}