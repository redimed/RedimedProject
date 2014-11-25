module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtCustomers", {
            'customer_id': { 
    type: DataTypes.INTEGER(5),  
            primaryKey: true,
                    },
            'store_id': { 
    type: DataTypes.INTEGER(3),  
            },
            'first_name': { 
    type: DataTypes.STRING(45),  
            },
            'last_name': { 
    type: DataTypes.STRING(45),  
            },
            'email': { 
    type: DataTypes.STRING(50),  
            },
            'address_id': { 
    type: DataTypes.INTEGER(5),  
            },
            'active': { 
    type: DataTypes.BOOLEAN,  
                defaultValue: 1,
        },
            'create_date': { 
    type: DataTypes.DATE,  
            },
            'last_update': { 
    type: DataTypes.DATE,  
                defaultValue: DataTypes.NOW,
        },
}, {
tableName: "customer",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}