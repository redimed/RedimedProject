module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysCasualCalendar", {
            'CASUAL_CAL_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'DOCTOR_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FROM_TIME': { 
    type: DataTypes.DATE,  
            },
            'TO_TIME': { 
    type: DataTypes.DATE,  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(50),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "sys_casual_calendar",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}