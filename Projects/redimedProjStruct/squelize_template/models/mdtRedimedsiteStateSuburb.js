module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtRedimedsiteStateSuburb", {
            'suburb_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'state_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'suburb_name': { 
    type: DataTypes.STRING(100),  
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
        }, {
tableName: "redimedsite_state_suburbs",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}