module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPayment", {
            'payment_id': { 
    type: DataTypes.INTEGER(5),  
            primaryKey: true,
                    },
            'customer_id': { 
    type: DataTypes.INTEGER(5),  
            },
            'staff_id': { 
    type: DataTypes.INTEGER(3),  
            },
            'rental_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'amount': { 
    type: DataTypes.DECIMAL(),  
            },
            'payment_date': { 
    type: DataTypes.DATE,  
            },
            'last_update': { 
    type: DataTypes.DATE,  
                defaultValue: DataTypes.NOW,
        },
}, {
tableName: "payment",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}