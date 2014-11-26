module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPmProperty", {
            'property_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Address': { 
    type: DataTypes.STRING(100),  
            },
            'Suburb': { 
    type: DataTypes.STRING(30),  
            },
            'Zipcode': { 
    type: DataTypes.STRING(10),  
            },
            'State': { 
    type: DataTypes.STRING(30),  
            },
            'Country': { 
    type: DataTypes.STRING(30),  
            },
            'Price': { 
    type: DataTypes.FLOAT,  
            },
            'purchase_date': { 
    type: DataTypes.DATE,  
            },
            'note': { 
    type: DataTypes.STRING(1000),  
            },
            'Cancellation_reason': { 
    type: DataTypes.STRING(1000),  
            },
            'isCancellation': { 
    type: DataTypes.INTEGER(11),  
            },
            'isInsurance': { 
    type: DataTypes.INTEGER(11),  
            },
            'Avatar_Pic_path': { 
    type: DataTypes.STRING(200),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "pm_properties",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}