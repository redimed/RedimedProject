module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysPermernantCalendarDfs", {
            'cal_header_df_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'doctor_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'day_of_Week': { 
    type: DataTypes.STRING(10),  
            },
            'from_time': { 
    type: DataTypes.DATE,  
            },
            'to_time': { 
    type: DataTypes.DATE,  
            },
            'description': { 
    type: DataTypes.STRING(60),  
            },
            'isenable': { 
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
tableName: "sys_permernant_calendar_df",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}