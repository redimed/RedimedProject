module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtCalendars", {
            'site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'cal_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'From_time': { 
    type: DataTypes.DATE,  
            },
            'to_time': { 
    type: DataTypes.DATE,  
            },
            'available': { 
    type: DataTypes.INTEGER(11),  
            },
            'booking': { 
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
tableName: "calendar",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}