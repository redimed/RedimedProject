module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnApptItems", {
            'appt_item_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'cal_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'CLN_ITEM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRICE': { 
    type: DataTypes.FLOAT,  
                defaultValue: 0,
        },
            'TIME_SPENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUANTITY': { 
    type: DataTypes.FLOAT,  
                defaultValue: 1,
        },
            'Patient_id': { 
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
            'AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'TAX_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSelect': { 
    type: DataTypes.INTEGER(1),  
                defaultValue: 0,
        },
            'tax_amount': { 
    type: DataTypes.FLOAT,  
            },
}, {
tableName: "cln_appt_items",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}