module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("Insurer", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
            autoIncrement: true,            
        },
            'insurer_name': { 
    type: DataTypes.STRING(200),  
            },
            'address': { 
    type: DataTypes.STRING(200),  
            },
            'suburb': { 
    type: DataTypes.STRING(200),  
            },
            'postcode': { 
    type: DataTypes.STRING(50),  
            },
            'state': { 
    type: DataTypes.STRING(100),  
            },
            'isenable': { 
    type: DataTypes.BOOLEAN,  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
    'phone':{type: DataTypes.STRING(15)},
    'country':{type: DataTypes.INTEGER(11)}
        }, {
tableName: "cln_insurers",
createdAt: "creation_date",
updatedAt: "last_update_date",
classMethods: {
    associate: function(models) {
        mdtInstance.hasMany(models.Company, {as: 
            'Companies',
             foreignKey: 'insurer_id', 
             through: 'company_insurers'
         });
    }
}
});
return mdtInstance;
}