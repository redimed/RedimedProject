module.exports = function(sequelize, DataTypes){
    var mdtInstance = sequelize.define("InvItemHeader", {
        'POPULAR_HEADER_ID': { 
            type: DataTypes.INTEGER(11),  
            primaryKey: true,
            autoIncrement: true,            
        },
        'POPULAR_CODE': { 
            type: DataTypes.STRING(200),  
        },
        'POPULAR_NAME': { 
            type: DataTypes.STRING(200),  
        },
        'ISENABLE': { 
            type: DataTypes.INTEGER(11),  
        },
        'Created_by': { 
            type: DataTypes.INTEGER(11),  
        },
        'Last_updated_by': { 
            type: DataTypes.INTEGER(11),  
        },
    }, {
        tableName: "cln_popular_item_headers",
        createdAt: "Creation_date",
        updatedAt: "Last_update_date",
        classMethods: {
            associate: function (models) {
                mdtInstance.hasMany(models.Department, {as: 'Departments', foreignKey: 'POPULAR_HEADER_ID', through: 'cln_dept_item_lists'});
            }
        }
    });
    return mdtInstance;
}