module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrTimeSheet", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'employee_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_date': { 
    type: DataTypes.DATE,  
            },
            'to_date': { 
    type: DataTypes.DATE,  
            },
            'iswork': { 
    type: DataTypes.INTEGER(11),  
            },
            'working_group': { 
    type: DataTypes.STRING(10),  
            },
            'working_type': { 
    type: DataTypes.STRING(10),  
            },
            'working_time': { 
    type: DataTypes.FLOAT,  
                defaultValue: '0',
        },
            'working_overtime': { 
    type: DataTypes.STRING(100),  
            },
            'note': { 
    type: DataTypes.STRING(200),  
            },
            'sheet_status': { 
    type: DataTypes.STRING(10),  
            },
            'feedback': { 
    type: DataTypes.STRING(200),  
            },
            'isLeave': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'weekOfYear': { 
    type: DataTypes.STRING(20),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "hr_time_sheet",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}