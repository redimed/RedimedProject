module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGlFormulaHeaders", {
            'formula_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'client': { 
    type: DataTypes.INTEGER(11),  
            },
            'site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'formula_code': { 
    type: DataTypes.STRING(250),  
            },
            'formula_description': { 
    type: DataTypes.STRING(250),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'creation_date': { 
    type: DataTypes.DATE,  
            },
            'last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'last_update_date': { 
    type: DataTypes.DATE,  
            },
            'company_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "gl_formula_header",
createdAt: "creation_date",
updatedAt: "last_update_date",
});
return mdtInstance;
}