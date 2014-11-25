module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGlFormulaLines", {
            'formula_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'formula_line_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'client': { 
    type: DataTypes.INTEGER(11),  
            },
            'company_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'seq_no': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id_t1': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id_t2': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id_t3': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id_t4': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id_t5': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id_t6': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id_t7': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id_t8': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id_t9': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_acc_id_t10': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id_t1': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id_t2': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id_t3': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id_t4': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id_t5': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id_t6': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id_t7': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id_t8': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id_t9': { 
    type: DataTypes.INTEGER(11),  
            },
            'to_acc_id_t10': { 
    type: DataTypes.INTEGER(11),  
            },
            'formula_type': { 
    type: DataTypes.STRING(50),  
            },
            'formula_dispatch': { 
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
}, {
tableName: "gl_formula_lines",
createdAt: "creation_date",
updatedAt: "last_update_date",
});
return mdtInstance;
}