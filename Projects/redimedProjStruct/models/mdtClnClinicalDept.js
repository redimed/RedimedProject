module.exports = function(sequelize, DataTypes){
    var mdtInstance = sequelize.define("Department", {
        'CLINICAL_DEPT_ID': { 
            type: DataTypes.INTEGER(11),  
            primaryKey: true,
        },
        'CLINICAL_DEPT_NAME': { 
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
        tableName: "cln_clinical_depts",
        createdAt: "Creation_date",
        updatedAt: "Last_update_date",
        classMethods: {
            associate: function (models) {
                mdtInstance.hasMany(models.Doctor, {
                    as: 'Doctors', foreignKey: 'CLINICAL_DEPT_ID'
                });
                mdtInstance.hasMany(models.InvItemHeader, {
                    as: 'ItemLists', foreignKey: 'CLINICAL_DEPT_ID', through: 'cln_dept_item_lists'
                });
            }
        }
    });
    return mdtInstance;
}