module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtRlBookingFiles", {
            'FILE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'BOOKING_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FILE_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'FILE_NAME': { 
    type: DataTypes.STRING(200),  
            },
            'FILE_BIN': { 
    type: DataTypes.BLOB,  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
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
            'isClientDownLoad': { 
    type: DataTypes.INTEGER(11),  
            },
            'dept_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'FILE_PATH': { 
    type: DataTypes.STRING(500),  
            },
}, {
tableName: "rl_booking_files",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}