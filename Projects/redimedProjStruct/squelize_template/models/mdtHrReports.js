module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrReports", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'report_code': { 
    type: DataTypes.STRING(50),  
            },
            'report_name': { 
    type: DataTypes.STRING(200),  
            },
            'form_name': { 
    type: DataTypes.STRING(200),  
            },
            'store_name': { 
    type: DataTypes.STRING(200),  
            },
            'file_name': { 
    type: DataTypes.STRING(200),  
            },
            'note': { 
    type: DataTypes.STRING(200),  
            },
            'module': { 
    type: DataTypes.STRING(50),  
            },
            'report_group': { 
    type: DataTypes.STRING(50),  
            },
            'enable': { 
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
}, {
tableName: "hr_report",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}