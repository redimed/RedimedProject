module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtCalendar", {
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
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "calendar",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}