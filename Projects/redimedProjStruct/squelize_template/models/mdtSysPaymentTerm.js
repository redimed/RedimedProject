module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysPaymentTerm", {
            'PAYMENT_TERM_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'PAYMENT_TERM': { 
    type: DataTypes.STRING(50),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'NO_OF_DAY': { 
    type: DataTypes.INTEGER(11),  
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
tableName: "sys_payment_terms",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}