module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtRedimedsite", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'Site_name': { 
    type: DataTypes.STRING(100),  
            },
            'Site_addr': { 
    type: DataTypes.STRING(100),  
            },
            'postcode': { 
    type: DataTypes.INTEGER(11),  
            },
            'State': { 
    type: DataTypes.STRING(25),  
            },
            'latitude': { 
    type: DataTypes.FLOAT,  
            },
            'longitude': { 
    type: DataTypes.FLOAT,  
            },
            'country': { 
    type: DataTypes.STRING(45),  
            },
            'Available_def': { 
    type: DataTypes.INTEGER(11),  
            },
            'booking_status': { 
    type: DataTypes.STRING(20),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'isPreEmpBK': { 
    type: DataTypes.INTEGER(11),  
            },
            'FOR_REDILEGAL': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'FOR_VACCINATION': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
}, {
tableName: "redimedsites",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}