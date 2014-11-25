module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPackages", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'package_name': { 
    type: DataTypes.STRING(100),  
            },
            'company_id': { 
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
            'item_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'item_code': { 
    type: DataTypes.STRING(20),  
            },
            'item_name': { 
    type: DataTypes.STRING(1000),  
            },
            'fee': { 
    type: DataTypes.FLOAT,  
            },
}, {
tableName: "packages",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}