module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnItemFee", {
            'ITEM_FEE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
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
            'BENEFIT1': { 
    type: DataTypes.FLOAT,  
            },
            'BENEFIT2': { 
    type: DataTypes.FLOAT,  
            },
            'BENEFIT3': { 
    type: DataTypes.FLOAT,  
            },
            'REBATE': { 
    type: DataTypes.FLOAT,  
            },
            'IP_REBATE': { 
    type: DataTypes.FLOAT,  
            },
            'PRIVATE': { 
    type: DataTypes.FLOAT,  
            },
            'PUBLIC': { 
    type: DataTypes.FLOAT,  
            },
            'PERSION': { 
    type: DataTypes.FLOAT,  
            },
            'DVA_GP_CONSULTS': { 
    type: DataTypes.FLOAT,  
            },
            'DVA_INPATIENT_PROC': { 
    type: DataTypes.FLOAT,  
            },
            'DVA_OUTPATIENT_PROC': { 
    type: DataTypes.FLOAT,  
            },
            'AMA': { 
    type: DataTypes.FLOAT,  
            },
            'WORK_COVER': { 
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