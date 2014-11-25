module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysCalendarHeaders", {
            'CAL_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'CAL_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATION_DATE': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "sys_calendar_headers",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}