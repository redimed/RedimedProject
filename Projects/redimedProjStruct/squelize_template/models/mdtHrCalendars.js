module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrCalendars", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'period': { 
    type: DataTypes.STRING(50),  
            },
            'year': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_date': { 
    type: DataTypes.DATE,  
            },
            'to_date': { 
    type: DataTypes.DATE,  
            },
            'calendar_status': { 
    type: DataTypes.INTEGER(10),  
            },
}, {
tableName: "hr_calendar",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}