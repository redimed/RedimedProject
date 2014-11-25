module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrTimeSheetLeaves", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'hr_time_sheet_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'leave_date': { 
    type: DataTypes.DATE,  
            },
            'leave_hour': { 
    type: DataTypes.FLOAT,  
            },
            'leave_reason': { 
    type: DataTypes.STRING(200),  
            },
            'leave_type': { 
    type: DataTypes.STRING(10),  
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
tableName: "hr_time_sheet_leave",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}