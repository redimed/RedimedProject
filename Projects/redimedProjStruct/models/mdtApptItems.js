module.exports = function(sequelize, DataTypes){
    var mdtInstance = sequelize.define("ApptItems", {
        'appt_item_id': { 
            type: DataTypes.INTEGER(11),  
            primaryKey: true,
            autoIncrement: true,           
        },
        'cal_id': { 
            type: DataTypes.INTEGER(11),  
        },
        'CLN_ITEM_ID': { 
            type: DataTypes.INTEGER(11),  
        },
        'PRICE': { 
            type: DataTypes.FLOAT,  
            defaultValue: '0',
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
        'Last_updated_by': { 
            type: DataTypes.INTEGER(11),  
        },
        'AMOUNT': { 
            type: DataTypes.FLOAT,  
        },
        'TAX_ID': { 
            type: DataTypes.INTEGER(11),  
        },
        'isSelect': { 
            type: DataTypes.INTEGER(1),  
            defaultValue: '0',
        },
        'tax_amount': { 
            type: DataTypes.FLOAT,  
        },
    }, {
        tableName: "cln_appt_items",
        createdAt: "Creation_date",
        updatedAt: "Last_update_date",
        classMethods: {
            associate: function(models){
                // Project.hasOne(User, { foreignKey: 'initiator_id' })
                mdtInstance.belongsTo(models.Appointment,{
                    as: 'Appointment', foreignKey: 'cal_id'
                });

                mdtInstance.belongsTo(models.InvItem, {
                    as: 'InvItem', foreignKey: 'CLN_ITEM_ID'
                });

            }
        }// end association
    });
return mdtInstance;
}