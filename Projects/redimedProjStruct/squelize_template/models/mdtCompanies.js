module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtCompanies", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'Company_name': { 
    type: DataTypes.STRING(100),  
            },
            'Industry': { 
    type: DataTypes.STRING(50),  
            },
            'Addr': { 
    type: DataTypes.STRING(100),  
            },
            'postcode': { 
    type: DataTypes.INTEGER(11),  
            },
            'State': { 
    type: DataTypes.STRING(25),  
            },
            'Description': { 
    type: DataTypes.STRING(250),  
            },
            'latitude': { 
    type: DataTypes.FLOAT,  
            },
            'longitude': { 
    type: DataTypes.FLOAT,  
            },
            'country': { 
    type: DataTypes.STRING(45),  
            },
            'result_email': { 
    type: DataTypes.STRING(100),  
            },
            'invoice_email': { 
    type: DataTypes.STRING(100),  
            },
            'PO_number': { 
    type: DataTypes.STRING(50),  
            },
            'isProject': { 
    type: DataTypes.INTEGER(4),  
            },
            'isCalendar': { 
    type: DataTypes.INTEGER(4),  
            },
            'father_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'report_to_email': { 
    type: DataTypes.STRING(50),  
            },
            'default_status': { 
    type: DataTypes.STRING(20),  
            },
            'isInvoiceEmailToUser': { 
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
            'isAddContactEmailToResult': { 
    type: DataTypes.INTEGER(11),  
            },
            'IMA': { 
    type: DataTypes.STRING(50),  
            },
            'Site_name': { 
    type: DataTypes.STRING(100),  
            },
            'Medic_contact_no': { 
    type: DataTypes.STRING(15),  
            },
            'Email': { 
    type: DataTypes.STRING(100),  
            },
            'CODE': { 
    type: DataTypes.STRING(100),  
            },
            'Insurer': { 
    type: DataTypes.INTEGER(11),  
            },
            'Phone': { 
    type: DataTypes.STRING(15),  
            },
            'Site_medic': { 
    type: DataTypes.STRING(100),  
            },
            'User_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPO': { 
    type: DataTypes.INTEGER(11),  
            },
            'isExtra': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "companies",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}