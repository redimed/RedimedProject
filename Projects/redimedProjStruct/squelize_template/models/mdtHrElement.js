module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrElement", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'element_code': { 
    type: DataTypes.STRING(10),  
            },
            'element_type': { 
    type: DataTypes.STRING(10),  
            },
            'element_name': { 
    type: DataTypes.STRING(100),  
            },
            'element_stand_by': { 
    type: DataTypes.STRING(10),  
            },
            'element_description': { 
    type: DataTypes.STRING(200),  
            },
            'element_Group': { 
    type: DataTypes.STRING(10),  
            },
            'curr_code': { 
    type: DataTypes.STRING(10),  
            },
            'element_S': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'element_AS': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'element_AM': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'element_SU': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'element_SB': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'element_TCa': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'element_IR': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'element_percent_salary': { 
    type: DataTypes.INTEGER(11),  
            },
            'element_Y': { 
    type: DataTypes.STRING(10),  
            },
            'element_G': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'isActive': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'note': { 
    type: DataTypes.STRING(200),  
            },
            'isenable': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'default_value': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_element",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}