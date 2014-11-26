module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGlHeader", {
            'header_id': { 
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
            'journal_no': { 
    type: DataTypes.STRING(45),  
            },
            'journal_date': { 
    type: DataTypes.DATE,  
            },
            'balance_type': { 
    type: DataTypes.STRING(45),  
            },
            'sob_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'period_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'period_name': { 
    type: DataTypes.STRING(250),  
            },
            'curr': { 
    type: DataTypes.STRING(45),  
            },
            'rate_type': { 
    type: DataTypes.STRING(45),  
            },
            'rate_date': { 
    type: DataTypes.DATE,  
            },
            'rate': { 
    type: DataTypes.FLOAT,  
            },
            'amount': { 
    type: DataTypes.FLOAT,  
            },
            'base_amount': { 
    type: DataTypes.FLOAT,  
            },
            'status': { 
    type: DataTypes.STRING(45),  
            },
            'description': { 
    type: DataTypes.STRING(250),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "gl_headers",
createdAt: "creation_date",
updatedAt: "last_update_date",
});
return mdtInstance;
}