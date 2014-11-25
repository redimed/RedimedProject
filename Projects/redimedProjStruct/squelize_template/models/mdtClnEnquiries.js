module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnEnquiries", {
            'enquiry_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'name_of_caller': { 
    type: DataTypes.STRING(100),  
            },
            'service_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'enquiry_company': { 
    type: DataTypes.STRING(100),  
            },
            'No_of_employee': { 
    type: DataTypes.INTEGER(11),  
            },
            'contact_phone_no': { 
    type: DataTypes.STRING(50),  
            },
            'note': { 
    type: DataTypes.STRING(500),  
            },
}, {
tableName: "cln_enquiries",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}