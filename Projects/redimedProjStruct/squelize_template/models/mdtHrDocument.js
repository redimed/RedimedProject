module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrDocument", {
            'DOC_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'DOC_NAME_document': { 
    type: DataTypes.STRING(200),  
            },
            'FROMDATE_document': { 
    type: DataTypes.DATE,  
            },
            'TODATE_document': { 
    type: DataTypes.DATE,  
            },
            'NOTES_document': { 
    type: DataTypes.STRING(200),  
            },
            'Files_document': { 
    type: DataTypes.STRING(200),  
            },
            'Employee_ID_document': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'CANDIDATE_ID_document': { 
    type: DataTypes.INTEGER(11),  
            },
            'original_file_name': { 
    type: DataTypes.STRING(200),  
            },
}, {
tableName: "hr_document",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}