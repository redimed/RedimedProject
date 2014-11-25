module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnWaitingLists", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'reason': { 
    type: DataTypes.TEXT,  
            },
            'priority': { 
    type: DataTypes.BOOLEAN,  
            },
            'doctor_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Patient_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "cln_waiting_lists",
createdAt: "Creation_date",
updatedAt: "",
});
return mdtInstance;
}