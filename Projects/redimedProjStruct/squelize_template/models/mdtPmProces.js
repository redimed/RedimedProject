module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPmProces", {
            'process_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'dept_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'seq': { 
    type: DataTypes.INTEGER(11),  
            },
            'process_name': { 
    type: DataTypes.STRING(100),  
            },
            'remind_after': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDailyRemins': { 
    type: DataTypes.INTEGER(11),  
            },
            'remind_title': { 
    type: DataTypes.STRING(100),  
            },
            'remind_content': { 
    type: DataTypes.STRING(1000),  
            },
            'isDoc': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPicture': { 
    type: DataTypes.INTEGER(11),  
            },
            'isFirst': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "pm_process",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}